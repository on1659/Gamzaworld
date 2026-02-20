<!-- Style 8: Retro Pixel - 8bit 레트로 게임 느낌 -->
<script>
  export let games;
  export let onStartGame;
  
  let animateText = false;
  
  onMount(() => {
    animateText = true;
  });
  
  import { onMount } from 'svelte';
</script>

<div class="lobby-style-8">
  <div class="crt-overlay"></div>
  <div class="pixel-grid"></div>
  
  <header class="header">
    <h1 class="pixel-title" class:animate={animateText}>
      ★ GAME SELECT ★
    </h1>
    <p class="credits">PRESS START</p>
  </header>

  <div class="games-arcade">
    {#each games as game, index}
      <button class="arcade-cabinet" on:click={() => onStartGame(game.id)}>
        <div class="cabinet-top"></div>
        <div class="screen">
          <div class="screen-glow"></div>
          <div class="game-emoji pixel-shake">{game.emoji}</div>
          <div class="game-name">{game.name}</div>
        </div>
        <div class="cabinet-bottom">
          <div class="button-row">
            <div class="arcade-button red"></div>
            <div class="arcade-button yellow"></div>
            <div class="arcade-button green"></div>
          </div>
          <div class="joystick">
            <div class="stick"></div>
            <div class="base"></div>
          </div>
        </div>
        <div class="difficulty-coin {game.difficulty}">
          {game.difficulty === 'easy' ? '1 COIN' : game.difficulty === 'normal' ? '2 COINS' : '3 COINS'}
        </div>
      </button>
    {/each}
  </div>
</div>

<style>
  .lobby-style-8 {
    position: relative;
    min-height: 100vh;
    background: #1a1a2e;
    padding: clamp(32px, 6vh, 64px) clamp(16px, 4vw, 48px);
    overflow: hidden;
  }

  /* CRT 효과 */
  .crt-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.15) 0px,
      transparent 1px,
      transparent 2px,
      rgba(0, 0, 0, 0.15) 3px
    );
    pointer-events: none;
    z-index: 10;
  }

  /* 픽셀 그리드 배경 */
  .pixel-grid {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image:
      linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.05) 75%, rgba(255, 255, 255, 0.05) 76%, transparent 77%, transparent),
      linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.05) 75%, rgba(255, 255, 255, 0.05) 76%, transparent 77%, transparent);
    background-size: 20px 20px;
    pointer-events: none;
    z-index: 0;
  }

  .header {
    position: relative;
    text-align: center;
    margin-bottom: clamp(32px, 6vh, 64px);
    z-index: 2;
  }

  .pixel-title {
    font-family: 'Courier New', 'Press Start 2P', monospace;
    font-size: clamp(20px, 5vw, 40px);
    color: #ffff00;
    text-shadow:
      4px 4px 0 #ff00ff,
      8px 8px 0 #00ffff;
    letter-spacing: 0.1em;
    margin-bottom: var(--spacing-md);
    animation: pixelBlink 2s infinite;
  }

  .credits {
    font-family: 'Courier New', monospace;
    font-size: clamp(12px, 2.5vw, 16px);
    color: #00ff00;
    letter-spacing: 0.2em;
    animation: blink 1s infinite;
  }

  .games-arcade {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
    gap: clamp(24px, 4vw, 48px);
    max-width: 1200px;
    margin: 0 auto;
    z-index: 2;
  }

  .arcade-cabinet {
    position: relative;
    background: linear-gradient(180deg, #8b4513 0%, #654321 100%);
    border: 4px solid #000;
    border-radius: 12px 12px 0 0;
    padding: 0;
    cursor: pointer;
    transition: transform 0.2s;
    box-shadow: 0 8px 0 #000;
  }

  .arcade-cabinet:hover {
    transform: translateY(-8px);
    box-shadow: 0 16px 0 #000;
  }

  .arcade-cabinet:active {
    transform: translateY(-4px);
    box-shadow: 0 12px 0 #000;
  }

  .cabinet-top {
    height: clamp(16px, 3vw, 24px);
    background: linear-gradient(180deg, #a0522d 0%, #8b4513 100%);
    border-bottom: 3px solid #000;
  }

  .screen {
    position: relative;
    background: #0a0a0a;
    border: 6px solid #333;
    margin: var(--spacing-md);
    padding: clamp(16px, 3vw, 32px);
    border-radius: 8px;
    overflow: hidden;
  }

  .screen-glow {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(0, 255, 0, 0.1) 0%, transparent 70%);
    pointer-events: none;
  }

  .game-emoji {
    font-size: clamp(48px, 10vw, 72px);
    text-align: center;
    margin-bottom: var(--spacing-sm);
    filter: drop-shadow(0 0 8px currentColor);
  }

  .pixel-shake {
    animation: pixelShake 0.5s infinite;
  }

  .game-name {
    font-family: 'Courier New', monospace;
    font-size: clamp(14px, 3vw, 18px);
    color: #00ff00;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    text-shadow: 2px 2px 0 #000;
  }

  .cabinet-bottom {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    background: linear-gradient(180deg, #654321 0%, #4a2f1a 100%);
  }

  .button-row {
    display: flex;
    gap: var(--spacing-xs);
    align-items: center;
  }

  .arcade-button {
    width: clamp(20px, 4vw, 32px);
    height: clamp(20px, 4vw, 32px);
    border-radius: 50%;
    border: 3px solid #000;
    box-shadow: inset 0 -4px 0 rgba(0, 0, 0, 0.3);
  }

  .arcade-button.red { background: #ff0000; }
  .arcade-button.yellow { background: #ffff00; }
  .arcade-button.green { background: #00ff00; }

  .joystick {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .stick {
    width: clamp(12px, 2.5vw, 16px);
    height: clamp(24px, 5vw, 40px);
    background: #000;
    border-radius: 8px;
  }

  .base {
    width: clamp(32px, 6vw, 48px);
    height: clamp(16px, 3vw, 24px);
    background: #333;
    border-radius: 50%;
    border: 3px solid #000;
  }

  .difficulty-coin {
    text-align: center;
    padding: var(--spacing-xs);
    font-family: 'Courier New', monospace;
    font-size: clamp(10px, 2vw, 12px);
    font-weight: bold;
    background: #000;
    color: #ffff00;
    border-top: 3px solid #000;
  }

  @keyframes pixelBlink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }

  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }

  @keyframes pixelShake {
    0%, 100% { transform: translate(0, 0); }
    25% { transform: translate(-2px, 0); }
    75% { transform: translate(2px, 0); }
  }

  @media (max-width: 768px) {
    .games-arcade {
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 180px), 1fr));
      gap: var(--spacing-lg);
    }
  }

  @media (max-width: 480px) {
    .lobby-style-8 {
      padding: var(--spacing-xl) var(--spacing-md);
    }

    .games-arcade {
      grid-template-columns: 1fr;
    }
  }
</style>
