<script>
  import { onMount, onDestroy } from 'svelte';
  import { GAME_CONFIG, StackTowerGame } from './logic.js';

  export let onBack = () => {};

  let canvas;
  let game = null;
  let gameState = null;
  let lastResult = null; // { perfect, score, timestamp }
  let rafId;

  const CW = GAME_CONFIG.gameWidth;
  const CH = GAME_CONFIG.gameHeight;

  // ── 렌더링 ─────────────────────────────────────────
  function drawGame(ctx) {
    if (!gameState) return;

    ctx.clearRect(0, 0, CW, CH);

    // 배경
    const bg = ctx.createLinearGradient(0, 0, 0, CH);
    bg.addColorStop(0, '#1a0533');
    bg.addColorStop(1, '#0d1b2a');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, CW, CH);

    // 쌓인 블록들
    gameState.stackedBlocks.forEach((block, i) => {
      const hue = 200 + (i * 15) % 160;
      ctx.fillStyle = `hsl(${hue}, 70%, 55%)`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = `hsl(${hue}, 70%, 55%)`;
      ctx.fillRect(block.x, block.y, block.width, GAME_CONFIG.blockHeight);
      ctx.shadowBlur = 0;
    });

    // 움직이는 블록
    if (gameState.status === 'running' || gameState.status === 'waiting') {
      const curr = gameState.currentBlock;
      ctx.fillStyle = '#ff6bce';
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#ff6bce';
      ctx.fillRect(curr.x, curr.y, curr.width, GAME_CONFIG.blockHeight);
      ctx.shadowBlur = 0;
    }

    // HUD
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 0, CW, 50);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${gameState.score}`, 10, 30);
    ctx.textAlign = 'right';
    ctx.fillText(`Lv.${gameState.level}`, CW - 10, 30);

    // Perfect 판정 표시
    if (lastResult && Date.now() - lastResult.timestamp < 800) {
      const alpha = 1 - (Date.now() - lastResult.timestamp) / 800;
      if (lastResult.perfect) {
        ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
        ctx.font = 'bold 32px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('✨ PERFECT!', CW / 2, CH / 2 - 20);
      }
    }

    // 대기 화면
    if (gameState.status === 'waiting') {
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, 0, CW, CH);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 28px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🏗️ 스택 타워', CW / 2, CH / 2 - 40);
      ctx.font = '18px sans-serif';
      ctx.fillStyle = '#ff6bce';
      ctx.fillText('SPACE 또는 화면 탭으로 시작!', CW / 2, CH / 2 + 10);
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.font = '14px sans-serif';
      ctx.fillText('블록을 쌓아 최고 점수를 노려봐!', CW / 2, CH / 2 + 45);
    }

    // 게임 오버
    if (gameState.status === 'gameover') {
      ctx.fillStyle = 'rgba(0,0,0,0.75)';
      ctx.fillRect(0, 0, CW, CH);
      ctx.fillStyle = '#ff4444';
      ctx.font = 'bold 32px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', CW / 2, CH / 2 - 50);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(`Score: ${gameState.score}`, CW / 2, CH / 2);
      ctx.fillText(`Level: ${gameState.level}`, CW / 2, CH / 2 + 35);
      ctx.fillStyle = '#ff6bce';
      ctx.font = '16px sans-serif';
      ctx.fillText('SPACE → 다시하기  |  ESC → 나가기', CW / 2, CH / 2 + 80);
    }
  }

  function gameLoop() {
    rafId = requestAnimationFrame(gameLoop);
    if (!canvas || !game) return;

    gameState = game.update();
    const ctx = canvas.getContext('2d');
    drawGame(ctx);
  }

  function handleDrop() {
    if (!game) return;

    if (gameState && gameState.status === 'gameover') {
      game = new StackTowerGame();
      gameState = game.getState();
      lastResult = null;
      return;
    }

    const result = game.drop();
    if (result) {
      if (result.gameover) {
        lastResult = null;
      } else {
        lastResult = { ...result, timestamp: Date.now() };
      }
    }
  }

  function handleKeydown(e) {
    if (e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      handleDrop();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      if (gameState && gameState.status === 'gameover') {
        onBack();
      } else {
        onBack();
      }
    }
  }

  onMount(() => {
    game = new StackTowerGame();
    gameState = game.getState();
    window.addEventListener('keydown', handleKeydown);
    rafId = requestAnimationFrame(gameLoop);
  });

  onDestroy(() => {
    if (rafId) cancelAnimationFrame(rafId);
    window.removeEventListener('keydown', handleKeydown);
  });
</script>

<div class="game-container">
  <canvas
    bind:this={canvas}
    width={CW}
    height={CH}
    on:click={handleDrop}
  ></canvas>
  <div class="controls">
    <p><strong>SPACE / 클릭</strong> - 블록 내려놓기</p>
    <p><strong>ESC</strong> - 나가기</p>
  </div>
</div>

<style>
  .game-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #1a0533 0%, #0d1b2a 100%);
    color: #fff;
  }

  canvas {
    border: 3px solid #ff6bce;
    border-radius: 8px;
    box-shadow: 0 8px 32px rgba(255, 107, 206, 0.4);
    cursor: pointer;
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
    color: #ff6bce;
  }
</style>
