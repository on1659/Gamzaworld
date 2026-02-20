<!-- Style 7: Minimal White - 심플 화이트 + 대형 타이포 -->
<script>
  export let games;
  export let onStartGame;
</script>

<div class="lobby-style-7">
  <header class="header">
    <h1 class="title">GAMES</h1>
    <div class="divider"></div>
  </header>

  <div class="games-list">
    {#each games as game, index}
      <button class="game-item" on:click={() => onStartGame(game.id)}>
        <div class="number">{String(index + 1).padStart(2, '0')}</div>
        <div class="content">
          <h2 class="name">{game.name}</h2>
          <p class="desc">{game.description}</p>
        </div>
        <div class="emoji">{game.emoji}</div>
        <div class="arrow">→</div>
      </button>
    {/each}
  </div>
</div>

<style>
  .lobby-style-7 {
    min-height: 100vh;
    background: #ffffff;
    padding: clamp(40px, 8vh, 80px) clamp(20px, 5vw, 80px);
  }

  .header {
    max-width: 1200px;
    margin: 0 auto var(--spacing-2xl);
  }

  .title {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: clamp(48px, 12vw, 120px);
    font-weight: 900;
    letter-spacing: -0.05em;
    color: #000;
    margin-bottom: var(--spacing-lg);
    line-height: 0.9;
  }

  .divider {
    width: 100%;
    height: 3px;
    background: #000;
  }

  .games-list {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .game-item {
    display: grid;
    grid-template-columns: auto 1fr auto auto;
    align-items: center;
    gap: clamp(16px, 3vw, 40px);
    padding: clamp(24px, 4vh, 40px) 0;
    border-bottom: 1px solid #e0e0e0;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: left;
  }

  .game-item:hover {
    background: #f8f8f8;
    padding-left: clamp(16px, 3vw, 32px);
  }

  .number {
    font-family: 'Courier New', monospace;
    font-size: clamp(14px, 2.5vw, 18px);
    font-weight: 600;
    color: #999;
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    min-width: 0;
  }

  .name {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: clamp(20px, 4vw, 36px);
    font-weight: 700;
    letter-spacing: -0.02em;
    color: #000;
    margin: 0;
  }

  .desc {
    font-size: clamp(12px, 2.5vw, 16px);
    color: #666;
    margin: 0;
    line-height: 1.5;
  }

  .emoji {
    font-size: clamp(32px, 6vw, 56px);
    flex-shrink: 0;
  }

  .arrow {
    font-size: clamp(24px, 4vw, 40px);
    color: #000;
    transform: translateX(0);
    transition: transform 0.3s ease;
    flex-shrink: 0;
  }

  .game-item:hover .arrow {
    transform: translateX(8px);
  }

  @media (max-width: 768px) {
    .game-item {
      grid-template-columns: auto 1fr auto;
      gap: var(--spacing-md);
    }

    .number {
      grid-row: 1;
      grid-column: 1;
    }

    .content {
      grid-row: 1;
      grid-column: 2;
    }

    .emoji {
      grid-row: 1;
      grid-column: 3;
    }

    .arrow {
      display: none;
    }
  }

  @media (max-width: 480px) {
    .lobby-style-7 {
      padding: var(--spacing-xl) var(--spacing-md);
    }

    .game-item {
      grid-template-columns: 1fr auto;
      gap: var(--spacing-sm);
      padding: var(--spacing-lg) 0;
    }

    .number {
      display: none;
    }

    .content {
      grid-column: 1;
    }

    .emoji {
      grid-column: 2;
    }
  }
</style>
