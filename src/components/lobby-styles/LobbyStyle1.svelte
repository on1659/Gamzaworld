<!-- Style 1: Grid Cards (현재 스타일 개선) -->
<script>
  export let games;
  export let onStartGame;
</script>

<div class="lobby-style-1">
  <header class="header">
    <h1 class="title">어떤 게임을 할까요?</h1>
    <p class="subtitle">도전하고 싶은 게임을 선택하세요! 🎮</p>
  </header>

  <div class="games-grid">
    {#each games as game}
      <article class="game-card" on:click={() => onStartGame(game.id)}>
        <div class="card-bg"></div>
        <div class="game-emoji">{game.emoji}</div>
        <h3 class="game-name">{game.name}</h3>
        <p class="game-desc">{game.description}</p>
        <div class="difficulty-badge {game.difficulty}">
          {game.difficulty === 'easy' ? '⭐ 쉬움' : game.difficulty === 'normal' ? '⭐⭐ 보통' : '⭐⭐⭐ 어려움'}
        </div>
      </article>
    {/each}
  </div>
</div>

<style>
  .lobby-style-1 {
    padding: var(--spacing-xl);
  }

  .header {
    text-align: center;
    margin-bottom: var(--spacing-2xl);
  }

  .title {
    font-family: var(--font-display);
    font-size: var(--font-size-3xl);
    color: var(--color-primary);
    margin-bottom: var(--spacing-sm);
  }

  .subtitle {
    font-size: var(--font-size-lg);
    color: var(--color-text-secondary);
  }

  .games-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--spacing-lg);
    max-width: 1200px;
    margin: 0 auto;
  }

  .game-card {
    position: relative;
    background: var(--color-bg-secondary);
    border: var(--border-width-thick) solid var(--color-border-primary);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-xl);
    cursor: pointer;
    transition: all var(--duration-normal) cubic-bezier(0.34, 1.56, 0.64, 1);
    overflow: hidden;
  }

  .card-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, transparent 0%, var(--color-primary-light) 100%);
    opacity: 0;
    transition: opacity var(--duration-normal);
  }

  .game-card:hover .card-bg {
    opacity: 0.1;
  }

  .game-card:hover {
    transform: translateY(-12px) rotate(2deg);
    box-shadow: var(--shadow-lg);
  }

  .game-emoji {
    font-size: 64px;
    text-align: center;
    margin-bottom: var(--spacing-md);
  }

  .game-name {
    font-family: var(--font-display);
    font-size: var(--font-size-xl);
    text-align: center;
    margin-bottom: var(--spacing-sm);
  }

  .game-desc {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    text-align: center;
    margin-bottom: var(--spacing-md);
  }

  .difficulty-badge {
    text-align: center;
    padding: var(--spacing-xs) var(--spacing-md);
    border-radius: var(--border-radius-full);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-bold);
    border: var(--border-width-thin) solid var(--color-border-primary);
  }

  .difficulty-badge.easy {
    background: var(--color-accent-1);
    color: white;
  }

  .difficulty-badge.normal {
    background: var(--color-secondary);
    color: var(--color-text-primary);
  }

  .difficulty-badge.hard {
    background: var(--color-primary);
    color: white;
  }

  @media (max-width: 768px) {
    .games-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
