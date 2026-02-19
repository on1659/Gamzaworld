<!-- Style 2: Carousel (가로 스와이프) -->
<script>
  export let games;
  export let onStartGame;
  
  let currentIndex = 0;
  
  function prev() {
    currentIndex = currentIndex > 0 ? currentIndex - 1 : games.length - 1;
  }
  
  function next() {
    currentIndex = currentIndex < games.length - 1 ? currentIndex + 1 : 0;
  }
</script>

<div class="lobby-style-2">
  <header class="header">
    <h1 class="title">스와이프해서 선택하세요</h1>
    <div class="dots">
      {#each games as _, i}
        <span class="dot" class:active={i === currentIndex}></span>
      {/each}
    </div>
  </header>

  <div class="carousel-container">
    <button class="nav-btn prev" on:click={prev}>←</button>
    
    <div class="carousel" style="transform: translateX(-{currentIndex * 100}%)">
      {#each games as game, i}
        <article class="game-slide" class:active={i === currentIndex}>
          <div class="game-content">
            <div class="game-emoji">{game.emoji}</div>
            <h2 class="game-name">{game.name}</h2>
            <p class="game-desc">{game.description}</p>
            <button class="play-btn" on:click={() => onStartGame(game.id)}>
              플레이 시작! 🎮
            </button>
          </div>
        </article>
      {/each}
    </div>
    
    <button class="nav-btn next" on:click={next}>→</button>
  </div>
</div>

<style>
  .lobby-style-2 {
    padding: var(--spacing-xl);
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .header {
    text-align: center;
    margin-bottom: var(--spacing-xl);
  }

  .title {
    font-family: var(--font-display);
    font-size: var(--font-size-2xl);
    color: var(--color-primary);
    margin-bottom: var(--spacing-md);
  }

  .dots {
    display: flex;
    justify-content: center;
    gap: var(--spacing-sm);
  }

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--color-border-light);
    transition: all var(--duration-fast);
  }

  .dot.active {
    background: var(--color-primary);
    transform: scale(1.3);
  }

  .carousel-container {
    flex: 1;
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
    overflow: hidden;
  }

  .carousel {
    display: flex;
    transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    flex: 1;
  }

  .game-slide {
    min-width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0.5;
    transform: scale(0.9);
    transition: all 0.5s;
  }

  .game-slide.active {
    opacity: 1;
    transform: scale(1);
  }

  .game-content {
    background: var(--color-bg-secondary);
    border: var(--border-width-thick) solid var(--color-border-primary);
    border-radius: var(--border-radius-xl);
    padding: var(--spacing-2xl);
    text-align: center;
    max-width: 400px;
    box-shadow: var(--shadow-lg);
  }

  .game-emoji {
    font-size: 120px;
    margin-bottom: var(--spacing-lg);
    animation: bounceFloat 3s ease-in-out infinite;
  }

  .game-name {
    font-family: var(--font-display);
    font-size: var(--font-size-3xl);
    margin-bottom: var(--spacing-md);
  }

  .game-desc {
    font-size: var(--font-size-lg);
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-xl);
  }

  .play-btn {
    width: 100%;
    padding: var(--spacing-lg);
    background: var(--color-primary);
    color: white;
    border: var(--border-width-thick) solid var(--color-border-primary);
    border-radius: var(--border-radius-md);
    font-family: var(--font-display);
    font-size: var(--font-size-xl);
    cursor: pointer;
    transition: all var(--duration-normal);
  }

  .play-btn:hover {
    transform: scale(1.05);
    box-shadow: var(--shadow-colored);
  }

  .nav-btn {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: var(--color-bg-secondary);
    border: var(--border-width-medium) solid var(--color-border-primary);
    font-size: var(--font-size-2xl);
    cursor: pointer;
    transition: all var(--duration-normal);
    flex-shrink: 0;
  }

  .nav-btn:hover {
    background: var(--color-primary);
    color: white;
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    .nav-btn {
      width: 48px;
      height: 48px;
      font-size: var(--font-size-xl);
    }

    .game-emoji {
      font-size: 80px;
    }
  }
</style>
