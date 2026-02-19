<!-- Style 3: Full Screen Swipe (틴더식) -->
<script>
  export let games;
  export let onStartGame;
  
  let currentIndex = 0;
  
  function swipeLeft() {
    if (currentIndex < games.length - 1) currentIndex++;
  }
  
  function swipeRight() {
    if (currentIndex > 0) currentIndex--;
  }
</script>

<div class="lobby-style-3">
  {#each games as game, i}
    <div class="game-card" class:active={i === currentIndex} class:prev={i < currentIndex} class:next={i > currentIndex}>
      <div class="card-inner">
        <div class="game-emoji">{game.emoji}</div>
        <h2 class="game-name">{game.name}</h2>
        <p class="game-desc">{game.description}</p>
        <div class="difficulty">{game.difficulty === 'easy' ? '쉬움' : game.difficulty === 'normal' ? '보통' : '어려움'}</div>
      </div>
    </div>
  {/each}
  
  <div class="actions">
    <button class="action-btn skip" on:click={swipeLeft} disabled={currentIndex === games.length - 1}>
      <span>👈 Skip</span>
    </button>
    <button class="action-btn play" on:click={() => onStartGame(games[currentIndex].id)}>
      <span>🎮 Play!</span>
    </button>
    <button class="action-btn next" on:click={swipeRight} disabled={currentIndex === 0}>
      <span>Next 👉</span>
    </button>
  </div>
  
  <div class="counter">{currentIndex + 1} / {games.length}</div>
</div>

<style>
  .lobby-style-3 {
    position: relative;
    width: 100%;
    height: 600px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .game-card {
    position: absolute;
    width: 90%;
    max-width: 400px;
    height: 500px;
    background: var(--color-bg-secondary);
    border: var(--border-width-mega) solid var(--color-border-primary);
    border-radius: var(--border-radius-xl);
    box-shadow: var(--shadow-lg);
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    opacity: 0;
    transform: scale(0.8) translateX(100px);
  }

  .game-card.active {
    opacity: 1;
    transform: scale(1) translateX(0);
    z-index: 10;
  }

  .game-card.prev {
    opacity: 0.3;
    transform: scale(0.9) translateX(-50px) rotate(-5deg);
    z-index: 5;
  }

  .game-card.next {
    opacity: 0.3;
    transform: scale(0.9) translateX(50px) rotate(5deg);
    z-index: 5;
  }

  .card-inner {
    padding: var(--spacing-2xl);
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .game-emoji {
    font-size: 120px;
    margin-bottom: var(--spacing-lg);
  }

  .game-name {
    font-family: var(--font-display);
    font-size: var(--font-size-3xl);
    margin-bottom: var(--spacing-md);
  }

  .game-desc {
    font-size: var(--font-size-lg);
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-lg);
  }

  .difficulty {
    padding: var(--spacing-sm) var(--spacing-lg);
    background: var(--color-primary);
    color: white;
    border-radius: var(--border-radius-full);
    font-family: var(--font-display);
  }

  .actions {
    position: absolute;
    bottom: 80px;
    display: flex;
    gap: var(--spacing-md);
    z-index: 20;
  }

  .action-btn {
    padding: var(--spacing-md) var(--spacing-lg);
    border: var(--border-width-medium) solid var(--color-border-primary);
    border-radius: var(--border-radius-full);
    font-family: var(--font-display);
    font-size: var(--font-size-lg);
    cursor: pointer;
    transition: all var(--duration-normal);
  }

  .action-btn.skip {
    background: var(--color-bg-tertiary);
  }

  .action-btn.play {
    background: var(--color-primary);
    color: white;
    padding: var(--spacing-md) var(--spacing-xl);
    transform: scale(1.2);
  }

  .action-btn.next {
    background: var(--color-bg-tertiary);
  }

  .action-btn:hover:not(:disabled) {
    transform: scale(1.1);
  }

  .action-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .counter {
    position: absolute;
    top: 20px;
    font-family: var(--font-display);
    font-size: var(--font-size-xl);
    color: var(--color-text-secondary);
  }
</style>
