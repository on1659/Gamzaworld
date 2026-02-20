<!-- Style 6: Dark Mode Neon - 다크 배경 + 네온 글로우 -->
<script>
  export let games;
  export let onStartGame;
</script>

<div class="lobby-style-6">
  <div class="neon-bg"></div>
  <div class="scanline"></div>
  
  <header class="header">
    <h1 class="neon-title">GAMZAWORLD</h1>
    <p class="subtitle">Choose Your Game</p>
  </header>

  <div class="games-container">
    {#each games as game}
      <button class="game-card" on:click={() => onStartGame(game.id)}>
        <div class="neon-border"></div>
        <div class="game-emoji">{game.emoji}</div>
        <h3 class="game-name">{game.name}</h3>
        <p class="game-desc">{game.description}</p>
        <div class="difficulty {game.difficulty}">
          {game.difficulty.toUpperCase()}
        </div>
      </button>
    {/each}
  </div>
</div>

<style>
  .lobby-style-6 {
    position: relative;
    min-height: 100vh;
    background: #0a0a0a;
    padding: var(--spacing-2xl) var(--spacing-xl);
    overflow: hidden;
  }

  /* 배경 네온 효과 */
  .neon-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 50%, rgba(255, 0, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 50%, rgba(0, 255, 255, 0.1) 0%, transparent 50%);
    animation: neonPulse 4s ease-in-out infinite;
    pointer-events: none;
    z-index: 0;
  }

  /* CRT 스캔라인 효과 */
  .scanline {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
      0deg,
      transparent 0px,
      rgba(255, 255, 255, 0.03) 1px,
      transparent 2px
    );
    pointer-events: none;
    z-index: 1;
  }

  .header {
    position: relative;
    text-align: center;
    margin-bottom: var(--spacing-2xl);
    z-index: 2;
  }

  .neon-title {
    font-family: 'Courier New', monospace;
    font-size: clamp(32px, 8vw, 64px);
    font-weight: 900;
    color: #fff;
    text-shadow:
      0 0 10px #ff00ff,
      0 0 20px #ff00ff,
      0 0 30px #ff00ff,
      0 0 40px #ff00ff,
      0 0 70px #ff00ff,
      0 0 80px #ff00ff;
    letter-spacing: 8px;
    margin-bottom: var(--spacing-md);
    animation: neonFlicker 3s infinite;
  }

  .subtitle {
    font-size: clamp(14px, 3vw, 18px);
    color: #0ff;
    text-transform: uppercase;
    letter-spacing: 4px;
    text-shadow: 0 0 10px #0ff;
  }

  .games-container {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
    gap: var(--spacing-xl);
    max-width: 1400px;
    margin: 0 auto;
    z-index: 2;
  }

  .game-card {
    position: relative;
    background: rgba(10, 10, 10, 0.8);
    border: 2px solid #333;
    border-radius: 16px;
    padding: var(--spacing-xl);
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    overflow: hidden;
    backdrop-filter: blur(10px);
  }

  .neon-border {
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, #ff00ff, #00ffff, #ff00ff);
    border-radius: 16px;
    opacity: 0;
    transition: opacity 0.3s;
    z-index: -1;
  }

  .game-card:hover .neon-border {
    opacity: 1;
    animation: neonRotate 2s linear infinite;
  }

  .game-card:hover {
    transform: translateY(-8px);
    box-shadow:
      0 0 20px rgba(255, 0, 255, 0.5),
      0 0 40px rgba(0, 255, 255, 0.3);
  }

  .game-emoji {
    font-size: clamp(48px, 10vw, 72px);
    text-align: center;
    margin-bottom: var(--spacing-md);
    filter: drop-shadow(0 0 10px currentColor);
  }

  .game-name {
    font-family: 'Courier New', monospace;
    font-size: clamp(18px, 4vw, 24px);
    font-weight: bold;
    color: #fff;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: var(--spacing-sm);
  }

  .game-desc {
    font-size: clamp(12px, 2.5vw, 14px);
    color: #aaa;
    text-align: center;
    margin-bottom: var(--spacing-md);
    line-height: 1.6;
  }

  .difficulty {
    text-align: center;
    padding: var(--spacing-xs) var(--spacing-md);
    border-radius: 20px;
    font-size: clamp(11px, 2.5vw, 13px);
    font-weight: bold;
    font-family: 'Courier New', monospace;
    letter-spacing: 1px;
  }

  .difficulty.easy {
    background: rgba(0, 255, 0, 0.2);
    color: #0f0;
    border: 1px solid #0f0;
    text-shadow: 0 0 5px #0f0;
  }

  .difficulty.normal {
    background: rgba(255, 255, 0, 0.2);
    color: #ff0;
    border: 1px solid #ff0;
    text-shadow: 0 0 5px #ff0;
  }

  .difficulty.hard {
    background: rgba(255, 0, 0, 0.2);
    color: #f00;
    border: 1px solid #f00;
    text-shadow: 0 0 5px #f00;
  }

  @keyframes neonPulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }

  @keyframes neonFlicker {
    0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
      text-shadow:
        0 0 10px #ff00ff,
        0 0 20px #ff00ff,
        0 0 30px #ff00ff,
        0 0 40px #ff00ff,
        0 0 70px #ff00ff,
        0 0 80px #ff00ff;
    }
    20%, 24%, 55% {
      text-shadow: none;
    }
  }

  @keyframes neonRotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @media (max-width: 768px) {
    .lobby-style-6 {
      padding: var(--spacing-xl) var(--spacing-md);
    }

    .games-container {
      gap: var(--spacing-md);
    }

    .neon-title {
      letter-spacing: 4px;
    }

    .subtitle {
      letter-spacing: 2px;
    }
  }
</style>
