<!-- Style 5: Minimal Modern (미니멀 대형 타이포) -->
<script>
  export let games;
  export let onStartGame;
</script>

<div class="lobby-style-5">
  {#each games as game}
    <div class="minimal-section" on:click={() => onStartGame(game.id)}>
      <div class="minimal-content">
        <span class="minimal-emoji">{game.emoji}</span>
        <h2 class="minimal-title">{game.name}</h2>
        <p class="minimal-subtitle">{game.description}</p>
        <div class="minimal-arrow">→</div>
      </div>
    </div>
  {/each}
</div>

<style>
  .lobby-style-5 {
    background: #fafafa;
    min-height: 600px;
  }

  .minimal-section {
    height: 200px;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.4s;
  }

  .minimal-section:hover {
    background: white;
    border-left: 6px solid #000;
    padding-left: 40px;
  }

  .minimal-content {
    display: flex;
    align-items: center;
    gap: var(--spacing-xl);
    max-width: 900px;
    width: 100%;
    padding: 0 var(--spacing-xl);
  }

  .minimal-emoji {
    font-size: 48px;
  }

  .minimal-title {
    font-family: var(--font-display);
    font-size: 48px;
    font-weight: 700;
    color: #000;
    letter-spacing: -2px;
  }

  .minimal-subtitle {
    flex: 1;
    color: #666;
    font-size: 18px;
  }

  .minimal-arrow {
    font-size: 48px;
    color: #000;
    opacity: 0;
    transform: translateX(-20px);
    transition: all 0.4s;
  }

  .minimal-section:hover .minimal-arrow {
    opacity: 1;
    transform: translateX(0);
  }

  @media (max-width: 768px) {
    .minimal-content {
      flex-direction: column;
      text-align: center;
    }
    
    .minimal-title {
      font-size: 32px;
    }
  }
</style>
