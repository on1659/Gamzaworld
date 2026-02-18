<script>
  import { onMount, onDestroy } from 'svelte';
  import { io } from 'socket.io-client';
  import { currentPage } from '../../stores.js';

  let socket;
  let canvas;
  let ctx;
  let gameState = null;
  let sessionId = null;
  let isGameOver = false;
  let finalScore = 0;

  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 400;

  onMount(() => {
    // Canvas 설정
    ctx = canvas.getContext('2d');
    
    // Socket 연결
    const socketUrl = import.meta.env.PROD 
      ? window.location.origin 
      : 'http://localhost:3000';
    
    socket = io(socketUrl);

    socket.on('connect', () => {
      console.log('Connected to game server');
      startGame();
    });

    socket.on('game:started', (state) => {
      console.log('Game started:', state);
      sessionId = state.sessionId;
      gameState = state;
    });

    socket.on('game:state', (state) => {
      gameState = state;
      render();

      // 게임 종료 체크
      if (state.state === 'finished') {
        onGameOver(state);
      }
    });

    socket.on('game:finished', (results) => {
      onGameOver(results);
    });

    socket.on('game:error', (error) => {
      console.error('Game error:', error);
      alert(error.message);
    });

    // 키보드 입력
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
  });

  onDestroy(() => {
    if (socket) socket.disconnect();
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
  });

  function startGame() {
    socket.emit('game:start', {
      gameId: 'timing-jump',
      mode: 'single',
      playerData: {
        username: '플레이어1'
      }
    });
  }

  function handleKeyDown(e) {
    if (e.code === 'Space' && !isGameOver) {
      e.preventDefault();
      socket.emit('game:input', { type: 'jump' });
    }
  }

  function handleKeyUp(e) {
    // 필요 시 구현
  }

  function handleCanvasClick() {
    if (!isGameOver) {
      socket.emit('game:input', { type: 'jump' });
    }
  }

  function render() {
    if (!ctx || !gameState) return;

    // 배경 지우기
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 바닥
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, 300, CANVAS_WIDTH, 100);

    // 플레이어 그리기
    if (gameState.players && gameState.players.length > 0) {
      const player = gameState.players[0];
      const playerX = gameState.config?.playerX || 100;
      
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(playerX, player.state.y, 40, 40);
      
      // 점수 표시
      ctx.fillStyle = '#000';
      ctx.font = 'bold 24px Arial';
      ctx.fillText(`점수: ${player.score}`, 20, 40);
    }

    // 장애물 그리기
    if (gameState.obstacles) {
      ctx.fillStyle = '#FF0000';
      for (const obstacle of gameState.obstacles) {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      }
    }
  }

  function onGameOver(results) {
    isGameOver = true;
    if (results.results && results.results.length > 0) {
      finalScore = results.results[0].score;
    } else if (results.players && results.players.length > 0) {
      finalScore = results.players[0].score;
    }
    
    // 게임 오버 화면 렌더링
    if (ctx) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      ctx.fillStyle = '#FFF';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('게임 오버!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40);
      
      ctx.font = 'bold 32px Arial';
      ctx.fillText(`최종 점수: ${finalScore}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
      
      ctx.font = '20px Arial';
      ctx.fillText('다시 하기는 아래 버튼 클릭', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 60);
    }
  }

  function restartGame() {
    isGameOver = false;
    finalScore = 0;
    gameState = null;
    startGame();
  }

  function goToLobby() {
    currentPage.set('lobby');
  }
</script>

<div class="game-container">
  <div class="game-header">
    <h2>🏃 타이밍 점프</h2>
    <button class="back-btn" on:click={goToLobby}>← 로비로</button>
  </div>

  <div class="game-canvas-wrapper">
    <canvas 
      bind:this={canvas}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      on:click={handleCanvasClick}
    ></canvas>
  </div>

  <div class="game-controls">
    <p>🎮 조작법: <strong>스페이스바</strong> 또는 <strong>화면 클릭</strong>으로 점프!</p>
    {#if isGameOver}
      <button class="restart-btn" on:click={restartGame}>🔄 다시 하기</button>
    {/if}
  </div>
</div>

<style>
  .game-container {
    max-width: 820px;
    margin: 0 auto;
  }

  .game-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  h2 {
    font-size: 28px;
    margin: 0;
    background: linear-gradient(135deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .back-btn {
    padding: 10px 20px;
    background: #f0f0f0;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
  }

  .back-btn:hover {
    background: #e0e0e0;
  }

  .game-canvas-wrapper {
    background: white;
    border-radius: 12px;
    padding: 10px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
  }

  canvas {
    display: block;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    cursor: pointer;
  }

  .game-controls {
    text-align: center;
  }

  .game-controls p {
    margin-bottom: 16px;
    color: #666;
  }

  .restart-btn {
    padding: 14px 32px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s;
  }

  .restart-btn:hover {
    transform: scale(1.05);
  }

  @media (max-width: 840px) {
    canvas {
      width: 100%;
      height: auto;
    }
  }
</style>
