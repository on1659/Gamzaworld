<script>
  import { onMount, onDestroy } from 'svelte';
  import { GAME_CONFIG, RhythmTapGame } from './logic.js';

  export let onBack = () => {};

  // ── 상태 ───────────────────────────────────────────
  let canvas;
  let game = null;
  let gameState = null;
  let lastJudgment = null; // { judgment, score, combo, timestamp }
  let rafId;

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

  // ── 게임 루프 (클라이언트 사이드) ────────────────
  let lastFrameTime = 0;
  const TARGET_FPS = 30;
  const FRAME_MS = 1000 / TARGET_FPS;

  function gameLoop(timestamp) {
    rafId = requestAnimationFrame(gameLoop);

    if (!canvas || !game) return;

    const elapsed = timestamp - lastFrameTime;
    if (elapsed < FRAME_MS) return;
    lastFrameTime = timestamp - (elapsed % FRAME_MS);

    // 게임 업데이트
    if (game.status === 'running') {
      gameState = game.update();
    }

    // 렌더링
    const ctx = canvas.getContext('2d');
    drawGame(ctx);
  }

  // ── 입력 (키보드) ─────────────────────────────────
  function handleKeydown(e) {
    // D, F, J, K → 레인 0, 1, 2, 3
    const keyToLane = { d: 0, D: 0, f: 1, F: 1, j: 2, J: 2, k: 3, K: 3 };
    if (keyToLane[e.key] !== undefined) {
      e.preventDefault();
      handleTap(keyToLane[e.key]);
      return;
    }

    // 게임 오버 후
    if (gameState && gameState.status === 'gameover') {
      if (e.key === ' ') {
        e.preventDefault();
        restartGame();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onBack();
      }
      return;
    }

    // ESC → 나가기
    if (e.key === 'Escape') {
      e.preventDefault();
      onBack();
    }
  }

  // ── 입력 (터치/클릭) ──────────────────────────────
  function handleCanvasClick(e) {
    if (!canvas) return;

    // 게임 오버면 재시작
    if (gameState && gameState.status === 'gameover') {
      restartGame();
      return;
    }

    // 클릭한 X 좌표로 레인 판별
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const scaleX = CW / rect.width;
    const x = (clientX - rect.left) * scaleX;

    // 각 레인의 중심 X 범위 판단
    const { laneCount, laneWidth, laneSpacing } = GAME_CONFIG;
    for (let i = 0; i < laneCount; i++) {
      const laneX = getLaneX(i);
      if (x >= laneX && x <= laneX + laneWidth) {
        handleTap(i);
        return;
      }
    }
  }

  function handleTap(lane) {
    if (!game || game.status !== 'running') return;
    const result = game.tap(lane);
    if (result) {
      lastJudgment = { ...result, timestamp: Date.now() };
    }
  }

  function restartGame() {
    game = new RhythmTapGame();
    gameState = game.getState();
    lastJudgment = null;
  }

  // ── 라이프사이클 ─────────────────────────────────
  onMount(() => {
    game = new RhythmTapGame();
    gameState = game.getState();
    window.addEventListener('keydown', handleKeydown);
    rafId = requestAnimationFrame(gameLoop);
  });

  onDestroy(() => {
    if (rafId) cancelAnimationFrame(rafId);
    window.removeEventListener('keydown', handleKeydown);
  });
</script>

<div class="game-wrapper">
  <!-- 헤더 -->
  <div class="game-header">
    <button class="back-btn" on:click={onBack}>← 로비</button>
    <h2 class="game-title">🎵 리듬 탭</h2>
    <div></div>
  </div>

  <!-- 캔버스 -->
  <div
    class="canvas-container"
    on:click={handleCanvasClick}
    on:touchstart|preventDefault={handleCanvasClick}
    role="button"
    tabindex="0"
  >
    <canvas bind:this={canvas} width={CW} height={CH}></canvas>
  </div>

  <!-- 조작 안내 -->
  <div class="controls">
    <p><strong>D F J K</strong> 또는 레인 탭 → 노트 치기</p>
    <p><strong>SPACE</strong> - 재시작 &nbsp; <strong>ESC</strong> - 나가기</p>
  </div>
</div>

<style>
  .game-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 24px 16px;
    width: 100%;
    max-width: 640px;
    min-height: 100vh;
    background: linear-gradient(135deg, #0f3460 0%, #1a1a2e 100%);
    color: #fff;
  }

  .game-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    max-width: 600px;
  }

  .back-btn {
    background: rgba(255, 255, 255, 0.15);
    border: 2px solid rgba(0, 217, 255, 0.5);
    border-radius: 20px;
    padding: 6px 16px;
    font-size: 14px;
    font-weight: 700;
    color: #00d9ff;
    cursor: pointer;
    transition: all 0.2s;
  }

  .back-btn:hover {
    background: rgba(0, 217, 255, 0.25);
    transform: translateX(-2px);
  }

  .game-title {
    font-size: 20px;
    font-weight: 900;
    color: #00d9ff;
    margin: 0;
  }

  .canvas-container {
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 217, 255, 0.3);
  }

  canvas {
    display: block;
    width: 100%;
    max-width: 600px;
    height: auto;
    border: 3px solid #00d9ff;
    border-radius: 8px;
    image-rendering: crisp-edges;
  }

  .controls {
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
