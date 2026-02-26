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

  // Vite proxy forwards /socket.io → localhost:3000 in dev
  const SERVER_URL = typeof window !== 'undefined' ? window.location.origin : '';

  const CW = GAME_CONFIG.gameWidth;   // 600
  const CH = GAME_CONFIG.gameHeight;  // 250
  const GROUND_Y = CH - 40;          // 캔버스에서 지면 Y 좌표

  // ── 유틸: 둥근 사각형 ─────────────────────────────
  function roundRect(ctx, x, y, w, h, r = 0) {
    const minR = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + minR, y);
    ctx.lineTo(x + w - minR, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + minR);
    ctx.lineTo(x + w, y + h - minR);
    ctx.quadraticCurveTo(x + w, y + h, x + w - minR, y + h);
    ctx.lineTo(x + minR, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - minR);
    ctx.lineTo(x, y + minR);
    ctx.quadraticCurveTo(x, y, x + minR, y);
    ctx.closePath();
  }

  // ── 렌더링 ────────────────────────────────────────
  function drawGame(ctx) {
    if (!gameState) return;
    ctx.clearRect(0, 0, CW, CH);

    // 하늘 그라디언트
    const sky = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
    sky.addColorStop(0, '#a8d8ea');
    sky.addColorStop(1, '#e8f4ff');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, CW, GROUND_Y);

    // 구름 (프레임 기반 패럴렉스)
    drawClouds(ctx);

    // 장애물
    for (const obs of gameState.obstacles) {
      drawObstacle(ctx, obs);
    }

    // 지면
    ctx.fillStyle = '#5cb85c';
    ctx.fillRect(0, GROUND_Y, CW, CH - GROUND_Y);
    ctx.fillStyle = '#4cae4c';
    ctx.fillRect(0, GROUND_Y, CW, 6);

    // 지면 줄무늬 (이동 효과)
    const stripeOffset = (gameState.frameCount * Math.max(2, gameState.speed * 0.5)) % 48;
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    for (let x = -stripeOffset; x < CW; x += 48) {
      ctx.fillRect(x, GROUND_Y + 10, 28, 3);
    }

    // 플레이어
    drawPlayer(ctx);

    // HUD (점수)
    drawHUD(ctx);

    // 게임 오버 오버레이
    if (gameState.status === 'gameover') {
      drawGameOver(ctx);
    }
  }

  function drawClouds(ctx) {
    const fc = gameState.frameCount;
    const clouds = [
      { baseX: 100, y: 30, speed: 0.3, size: 1.0 },
      { baseX: 320, y: 20, speed: 0.5, size: 0.7 },
      { baseX: 500, y: 45, speed: 0.4, size: 1.2 },
    ];
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    for (const c of clouds) {
      const x = ((c.baseX - fc * c.speed) % (CW + 120) + CW + 120) % (CW + 120) - 60;
      const s = c.size;
      ctx.beginPath();
      ctx.arc(x,        c.y,      20 * s, 0, Math.PI * 2);
      ctx.arc(x + 22*s, c.y - 8*s, 16*s, 0, Math.PI * 2);
      ctx.arc(x + 38*s, c.y,      14 * s, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawObstacle(ctx, obs) {
    const { GAME_CONFIG: cfg } = { GAME_CONFIG };
    const obsY = GROUND_Y - obs.height;

    // 몸통
    ctx.fillStyle = obs.passed ? '#81c784' : '#e64a19';
    roundRect(ctx, obs.x, obsY, obs.width, obs.height, 4);
    ctx.fill();

    // 하이라이트 스트라이프
    ctx.fillStyle = obs.passed ? '#a5d6a7' : '#ff7043';
    ctx.fillRect(obs.x + 5, obsY + 6, 5, obs.height - 10);

    // 윗 뚜껑 (돌출)
    ctx.fillStyle = obs.passed ? '#66bb6a' : '#bf360c';
    roundRect(ctx, obs.x - 3, obsY - 1, obs.width + 6, 8, 3);
    ctx.fill();
  }

  function drawPlayer(ctx) {
    const { playerX, playerWidth: pw, playerHeight: ph } = GAME_CONFIG;
    const playerCanvasY = GROUND_Y + gameState.playerY - ph;
    const isGameOver = gameState.status === 'gameover';

    // 그림자
    const shadowAlpha = Math.max(0, 0.25 - Math.abs(gameState.playerY) / 400);
    if (shadowAlpha > 0.01) {
      ctx.fillStyle = `rgba(0,0,0,${shadowAlpha})`;
      ctx.beginPath();
      const sw = pw * Math.max(0.3, 1 - Math.abs(gameState.playerY) / 120);
      ctx.ellipse(playerX + pw / 2, GROUND_Y + 3, sw, 4, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // 몸통
    ctx.fillStyle = isGameOver ? '#e53935' : '#ff6b9d';
    roundRect(ctx, playerX, playerCanvasY, pw, ph, 8);
    ctx.fill();

    // 귀
    ctx.fillStyle = isGameOver ? '#ef9a9a' : '#ff8fab';
    ctx.beginPath();
    ctx.ellipse(playerX + 7,      playerCanvasY - 5, 5, 8, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(playerX + pw - 7, playerCanvasY - 5, 5, 8, 0.3,  0, Math.PI * 2);
    ctx.fill();

    // 눈
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(playerX + pw * 0.62, playerCanvasY + ph * 0.28, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = isGameOver ? '#555' : '#1a1a2e';
    ctx.beginPath();
    ctx.arc(playerX + pw * 0.65, playerCanvasY + ph * 0.28, 3, 0, Math.PI * 2);
    ctx.fill();

    // 반짝이 (눈빛)
    if (!isGameOver) {
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(playerX + pw * 0.68, playerCanvasY + ph * 0.24, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // 달리기 다리 애니메이션 (지면에 있을 때)
    if (gameState.isOnGround) {
      const leg = Math.sin(gameState.frameCount * 0.35) * 5;
      ctx.fillStyle = isGameOver ? '#ef9a9a' : '#e91e8c';
      ctx.beginPath();
      roundRect(ctx, playerX + 4,       playerCanvasY + ph - 4, 9, 6 + leg, 2);
      ctx.fill();
      ctx.beginPath();
      roundRect(ctx, playerX + pw - 13, playerCanvasY + ph - 4, 9, 6 - leg, 2);
      ctx.fill();
    }
  }

  function drawHUD(ctx) {
    // 점수판
    ctx.fillStyle = 'rgba(255,255,255,0.88)';
    roundRect(ctx, 10, 10, 140, 38, 10);
    ctx.fill();

    ctx.fillStyle = '#c2185b';
    ctx.font = 'bold 19px Pretendard, "Apple SD Gothic Neo", sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillText(`점수: ${gameState.score}`, 22, 29);
    ctx.textBaseline = 'alphabetic';
  }

  function drawGameOver(ctx) {
    // 반투명 오버레이
    ctx.fillStyle = 'rgba(0,0,0,0.52)';
    ctx.fillRect(0, 0, CW, CH);

    // 패널
    const pw = 300, ph = 130;
    const px = (CW - pw) / 2;
    const py = (CH - ph) / 2;
    ctx.fillStyle = 'white';
    roundRect(ctx, px, py, pw, ph, 18);
    ctx.fill();

    ctx.textAlign = 'center';

    // 제목
    ctx.fillStyle = '#e53935';
    ctx.font = 'bold 28px Pretendard, "Apple SD Gothic Neo", sans-serif';
    ctx.fillText('게임 오버! 😢', CW / 2, py + 42);

    // 점수
    ctx.fillStyle = '#555';
    ctx.font = '18px Pretendard, "Apple SD Gothic Neo", sans-serif';
    ctx.fillText(`최종 점수: ${gameState.score}점`, CW / 2, py + 76);

    // 재시작 안내
    ctx.fillStyle = '#aaa';
    ctx.font = '14px Pretendard, "Apple SD Gothic Neo", sans-serif';
    ctx.fillText('스페이스 / 화면 탭 → 재시작', CW / 2, py + 105);

    ctx.textAlign = 'left';
  }

  // ── 소켓 & 게임 제어 ──────────────────────────────
  function startGame() {
    socket.emit('game:start', {
      gameId: 'timing-jump',
      mode: 'single',
      playerData: { name: '플레이어' },
    });
  }

  function handleJump() {
    if (!connected || !socket) return;

    if (gameState?.status === 'gameover') {
      startGame();
      return;
    }
    socket.emit('game:input', { type: 'jump' });
  }

  function handleKeydown(e) {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      e.preventDefault();
      handleJump();
    }
    if (e.code === 'Escape') {
      onBack();
    }
  }

  // ── 라이프사이클 ──────────────────────────────────
  onMount(() => {
    const ctx = canvas.getContext('2d');

    // 초기 대기 화면
    ctx.fillStyle = '#a8d8ea';
    ctx.fillRect(0, 0, CW, CH);
    ctx.fillStyle = '#333';
    ctx.font = '18px Pretendard, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('서버 연결 중...', CW / 2, CH / 2);
    ctx.textAlign = 'left';

    socket = io(SERVER_URL, { transports: ['websocket'] });

    socket.on('connect', () => {
      connected = true;
      connecting = false;
      startGame();
    });

    socket.on('connect_error', () => {
      connecting = false;
      errorMsg = '서버 연결 실패. 잠시 후 다시 시도해주세요.';
    });

    socket.on('game:started', (state) => {
      gameState = state;
      drawGame(ctx);
    });

    socket.on('game:state', (state) => {
      gameState = state;
      drawGame(ctx);
    });

    socket.on('game:error', (err) => {
      console.error('[Game Error]', err);
      errorMsg = err.message || '알 수 없는 오류가 발생했습니다.';
    });

    window.addEventListener('keydown', handleKeydown);
  });

  onDestroy(() => {
    if (socket) socket.disconnect();
    window.removeEventListener('keydown', handleKeydown);
  });
</script>

<!-- ── 레이아웃 ───────────────────────────────────── -->
<div class="game-wrapper">
  <!-- 헤더 -->
  <div class="game-header">
    <button class="back-btn" on:click={onBack}>← 로비</button>
    <h2 class="game-title">🏃 타이밍 점프</h2>
    <div></div>
  </div>

  <!-- 캔버스 컨테이너 -->
  <div class="canvas-container" on:click={handleJump} on:touchstart|preventDefault={handleJump} on:keydown={handleKeydown} role="button" tabindex="0">
    <canvas
      bind:this={canvas}
      width={CW}
      height={CH}
      class="game-canvas"
    ></canvas>

    {#if connecting}
      <div class="overlay-msg">🔄 서버 연결 중...</div>
    {:else if errorMsg}
      <div class="overlay-msg error">{errorMsg}</div>
    {/if}
  </div>

  <!-- 조작 안내 -->
  <div class="controls-hint">
    <span>⌨️ <strong>Space / ↑</strong> 점프</span>
    <span>📱 화면 탭으로도 점프!</span>
    <span>⏎ <strong>ESC</strong> 로비</span>
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
  }

  .game-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    max-width: 600px;
  }

  .back-btn {
    background: rgba(255,255,255,0.7);
    border: 2px solid #ffb3d9;
    border-radius: 20px;
    padding: 6px 16px;
    font-size: 14px;
    font-weight: 700;
    color: #c2185b;
    cursor: pointer;
    transition: all 0.2s;
  }
  .back-btn:hover {
    background: #ffb3d9;
    color: white;
    transform: translateX(-2px);
  }

  .game-title {
    font-size: 20px;
    font-weight: 900;
    color: #ff6b9d;
    margin: 0;
  }

  .canvas-container {
    position: relative;
    width: 100%;
    max-width: 600px;
    cursor: pointer;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18),
                0 0 0 4px rgba(255, 107, 157, 0.3);
    user-select: none;
    -webkit-user-select: none;
  }

  .game-canvas {
    display: block;
    width: 100%;
    height: auto;
    image-rendering: pixelated;
  }

  .overlay-msg {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.45);
    color: white;
    font-size: 18px;
    font-weight: 700;
    border-radius: 16px;
  }
  .overlay-msg.error {
    background: rgba(180, 0, 0, 0.6);
  }

  .controls-hint {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    justify-content: center;
    font-size: 13px;
    color: #8b5a8e;
    background: rgba(255,255,255,0.6);
    border-radius: 12px;
    padding: 8px 18px;
  }
  .controls-hint span {
    white-space: nowrap;
  }

  @media (max-width: 480px) {
    .controls-hint {
      gap: 12px;
      font-size: 12px;
    }
  }
</style>
