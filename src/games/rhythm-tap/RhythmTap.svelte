<script>
  import { onMount, onDestroy } from 'svelte';
  import { io } from 'socket.io-client';
  import { GAME_CONFIG } from './logic.js';

  export let onBack = () => {};

  // ── 상태 ───────────────────────────────────────────
  let canvas;
  let socket;
  let gameState = null;
  let connected = false;
  let connecting = true;
  let errorMsg = '';
  let lastJudgment = null; // { judgment, score, combo, timestamp }

  const SERVER_URL = import.meta.env.DEV
    ? 'http://localhost:3000'
    : (typeof window !== 'undefined' ? window.location.origin : '');

  const CW = GAME_CONFIG.gameWidth;   // 600
  const CH = GAME_CONFIG.gameHeight;  // 400

  // 레인 X 좌표 계산
  function getLaneX(lane) {
    const { laneWidth, laneSpacing } = GAME_CONFIG;
    return laneSpacing + lane * (laneWidth + laneSpacing / 2);
  }

  // ── 렌더링 ────────────────────────────────────────
  function drawGame(ctx) {
    if (!gameState) return;
    ctx.clearRect(0, 0, CW, CH);

    // 배경 그라디언트
    const bg = ctx.createLinearGradient(0, 0, 0, CH);
    bg.addColorStop(0, '#1a1a2e');
    bg.addColorStop(1, '#0f3460');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, CW, CH);

    // 레인 라인
    drawLanes(ctx);

    // 타겟 존 (판정 라인)
    drawTargetZone(ctx);

    // 노트
    for (const note of gameState.notes) {
      if (!note.hit) {
        drawNote(ctx, note);
      }
    }

    // HUD
    drawHUD(ctx);

    // 판정 표시
    if (lastJudgment && Date.now() - lastJudgment.timestamp < 500) {
      drawJudgment(ctx);
    }

    // 게임 오버
    if (gameState.status === 'gameover') {
      drawGameOver(ctx);
    }
  }

  function drawLanes(ctx) {
    const { laneCount, laneWidth, laneSpacing } = GAME_CONFIG;
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 2;

    for (let i = 0; i <= laneCount; i++) {
      const x = laneSpacing + i * (laneWidth + laneSpacing / 2);
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CH);
      ctx.stroke();
    }
  }

  function drawTargetZone(ctx) {
    const { targetY, targetHeight, laneCount, laneWidth, laneSpacing } = GAME_CONFIG;
    const y = targetY - targetHeight / 2;

    // 배경
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fillRect(0, y, CW, targetHeight);

    // 레인별 타겟 박스
    ctx.strokeStyle = '#00d9ff';
    ctx.lineWidth = 3;
    for (let i = 0; i < laneCount; i++) {
      const x = getLaneX(i);
      ctx.strokeRect(x + 5, y + 5, laneWidth - 10, targetHeight - 10);
    }

    // 중심 라인
    ctx.strokeStyle = '#ff006e';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 5]);
    ctx.beginPath();
    ctx.moveTo(0, targetY);
    ctx.lineTo(CW, targetY);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function drawNote(ctx, note) {
    const { laneWidth, noteHeight } = GAME_CONFIG;
    const x = getLaneX(note.lane);
    const y = note.y - noteHeight / 2;

    // 노트 바디
    ctx.fillStyle = '#ff6b9d';
    ctx.fillRect(x + 8, y, laneWidth - 16, noteHeight);

    // 외곽선
    ctx.strokeStyle = '#ff1493';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 8, y, laneWidth - 16, noteHeight);

    // 하이라이트
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillRect(x + 10, y + 2, laneWidth - 20, 4);
  }

  function drawHUD(ctx) {
    ctx.save();

    // 점수
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 32px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(gameState.score.toString(), CW - 20, 40);

    // 콤보
    if (gameState.combo > 0) {
      ctx.fillStyle = gameState.combo >= 50 ? '#ffd700' :
                      gameState.combo >= 20 ? '#ff6b9d' :
                      gameState.combo >= 10 ? '#00d9ff' : '#fff';
      ctx.font = 'bold 48px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${gameState.combo}x`, CW / 2, 60);

      ctx.font = '16px sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fillText('COMBO', CW / 2, 80);
    }

    // 통계 (좌측 상단)
    ctx.font = '14px monospace';
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    const stats = gameState.stats;
    ctx.fillText(`P:${stats.perfect} G:${stats.great} O:${stats.good} M:${stats.miss}`, 20, 25);

    ctx.restore();
  }

  function drawJudgment(ctx) {
    if (!lastJudgment) return;
    const elapsed = Date.now() - lastJudgment.timestamp;
    const alpha = Math.max(0, 1 - elapsed / 500);

    ctx.save();
    ctx.globalAlpha = alpha;

    const { judgment, score, combo } = lastJudgment;
    let color = '#fff';
    let text = '';

    if (judgment === 'perfect') {
      color = '#ffd700';
      text = 'PERFECT!';
    } else if (judgment === 'great') {
      color = '#00d9ff';
      text = 'GREAT!';
    } else if (judgment === 'good') {
      color = '#4caf50';
      text = 'GOOD';
    } else {
      color = '#e53935';
      text = 'MISS';
    }

    ctx.fillStyle = color;
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(text, CW / 2, CH / 2 - 30);

    if (score > 0) {
      ctx.font = 'bold 24px monospace';
      ctx.fillText(`+${score}`, CW / 2, CH / 2 + 10);
    }

    ctx.restore();
  }

  function drawGameOver(ctx) {
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.fillRect(0, 0, CW, CH);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 48px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', CW / 2, CH / 2 - 60);

    ctx.font = '24px monospace';
    ctx.fillText(`Score: ${gameState.score}`, CW / 2, CH / 2 - 10);
    ctx.fillText(`Max Combo: ${gameState.maxCombo}`, CW / 2, CH / 2 + 30);

    const stats = gameState.stats;
    ctx.font = '18px monospace';
    ctx.fillText(`Perfect: ${stats.perfect}  Great: ${stats.great}`, CW / 2, CH / 2 + 65);
    ctx.fillText(`Good: ${stats.good}  Miss: ${stats.miss}`, CW / 2, CH / 2 + 90);

    ctx.font = '16px sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillText('Press SPACE to retry, ESC to exit', CW / 2, CH / 2 + 130);
  }

  // ── Socket.IO ─────────────────────────────────────
  function connectSocket() {
    socket = io(SERVER_URL);

    socket.on('connect', () => {
      console.log('[RhythmTap] Socket connected');
      connected = true;
      connecting = false;
      socket.emit('game:start', { gameId: 'rhythm-tap', mode: 'single' });
    });

    socket.on('game:started', (data) => {
      console.log('[RhythmTap] 게임 시작:', data);
      gameState = data;
    });

    socket.on('game:state', (state) => {
      gameState = state;
    });

    socket.on('game:judgment', (result) => {
      console.log('[RhythmTap] 판정:', result);
      lastJudgment = { ...result, timestamp: Date.now() };
    });

    socket.on('game:ended', (data) => {
      console.log('[RhythmTap] 게임 종료:', data);
      if (gameState) {
        gameState.status = 'gameover';
      }
    });

    socket.on('disconnect', () => {
      console.warn('[RhythmTap] Socket disconnected');
      connected = false;
      errorMsg = '서버 연결 끊김';
    });

    socket.on('connect_error', (err) => {
      console.error('[RhythmTap] 연결 실패:', err);
      connected = false;
      connecting = false;
      errorMsg = '서버 연결 실패';
    });
  }

  // ── 입력 (키보드) ─────────────────────────────────
  function handleKeydown(e) {
    if (!socket || !connected) return;

    // D, F, J, K → 레인 0, 1, 2, 3
    const keyToLane = { d: 0, D: 0, f: 1, F: 1, j: 2, J: 2, k: 3, K: 3 };
    if (keyToLane[e.key] !== undefined) {
      e.preventDefault();
      socket.emit('game:input', { type: 'tap', lane: keyToLane[e.key] });
      return;
    }

    // 게임 오버 후
    if (gameState && gameState.status === 'gameover') {
      if (e.key === ' ') {
        e.preventDefault();
        restartGame();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        cleanup();
        onBack();
      }
    }

    // ESC → 나가기
    if (e.key === 'Escape') {
      e.preventDefault();
      cleanup();
      onBack();
    }
  }

  function restartGame() {
    if (socket && connected) {
      socket.emit('game:start', { gameId: 'rhythm-tap', mode: 'single' });
      lastJudgment = null;
    }
  }

  // ── 렌더 루프 ─────────────────────────────────────
  let rafId;
  function renderLoop() {
    if (canvas) {
      const ctx = canvas.getContext('2d');
      drawGame(ctx);
    }
    rafId = requestAnimationFrame(renderLoop);
  }

  // ── 라이프사이클 ─────────────────────────────────
  onMount(() => {
    connectSocket();
    window.addEventListener('keydown', handleKeydown);
    renderLoop();
  });

  onDestroy(() => {
    cleanup();
  });

  function cleanup() {
    if (rafId) cancelAnimationFrame(rafId);
    window.removeEventListener('keydown', handleKeydown);
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  }
</script>

<div class="game-container">
  {#if connecting}
    <div class="loading">서버 연결 중...</div>
  {:else if errorMsg}
    <div class="error">
      <p>{errorMsg}</p>
      <button on:click={onBack}>돌아가기</button>
    </div>
  {:else}
    <canvas bind:this={canvas} width={CW} height={CH}></canvas>
    <div class="controls">
      <p><strong>D F J K</strong> - Tap notes</p>
      <p><strong>ESC</strong> - Exit</p>
    </div>
  {/if}
</div>

<style>
  .game-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #0f3460 0%, #1a1a2e 100%);
    color: #fff;
  }

  canvas {
    border: 3px solid #00d9ff;
    border-radius: 8px;
    box-shadow: 0 8px 32px rgba(0, 217, 255, 0.4);
    image-rendering: crisp-edges;
  }

  .loading,
  .error {
    font-size: 24px;
    text-align: center;
  }

  .error button {
    margin-top: 20px;
    padding: 12px 24px;
    font-size: 18px;
    background: #00d9ff;
    color: #1a1a2e;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }

  .error button:hover {
    background: #00b8d4;
  }

  .controls {
    margin-top: 20px;
    text-align: center;
    font-size: 14px;
    opacity: 0.8;
  }

  .controls p {
    margin: 4px 0;
  }

  .controls strong {
    color: #00d9ff;
  }
</style>
