<!-- Style 4: Neon Cyber (네온 사이버펑크) -->
<script>
  export let games;
  export let onStartGame;
</script>

<div class="lobby-style-4">
  <div class="cyber-grid">
    {#each games as game}
      <div class="cyber-card" on:click={() => onStartGame(game.id)}>
        <div class="neon-border"></div>
        <div class="glitch-text">{game.emoji}</div>
        <h3 class="cyber-title">{game.name.toUpperCase()}</h3>
        <p class="cyber-desc">{'>'} {game.description}</p>
        <div class="cyber-button">[ PLAY NOW ]</div>
      </div>
    {/each}
  </div>
</div>

<style>
  .lobby-style-4 {
    background: #0a0a0a;
    padding: var(--spacing-xl);
    min-height: 600px;
  }

  .cyber-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--spacing-xl);
    max-width: 1200px;
    margin: 0 auto;
  }

  .cyber-card {
    position: relative;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    border: 2px solid #00ff9f;
    padding: var(--spacing-xl);
    cursor: pointer;
    transition: all 0.3s;
    overflow: hidden;
  }

  .neon-border {
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, #00ff9f, #00b8ff, #ff00ff, #00ff9f);
    background-size: 400%;
    opacity: 0;
    transition: opacity 0.3s;
    z-index: -1;
    animation: neonMove 3s linear infinite;
  }

  @keyframes neonMove {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }

  .cyber-card:hover .neon-border {
    opacity: 1;
  }

  .cyber-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 40px rgba(0, 255, 159, 0.3);
  }

  .glitch-text {
    font-size: 80px;
    text-align: center;
    margin-bottom: var(--spacing-md);
    filter: drop-shadow(0 0 10px #00ff9f);
  }

  .cyber-title {
    font-family: 'Courier New', monospace;
    font-size: var(--font-size-xl);
    color: #00ff9f;
    text-align: center;
    margin-bottom: var(--spacing-sm);
    letter-spacing: 3px;
    text-shadow: 0 0 10px #00ff9f;
  }

  .cyber-desc {
    font-family: 'Courier New', monospace;
    color: #00b8ff;
    text-align: center;
    margin-bottom: var(--spacing-lg);
    font-size: var(--font-size-sm);
  }

  .cyber-button {
    font-family: 'Courier New', monospace;
    text-align: center;
    padding: var(--spacing-md);
    border: 2px solid #ff00ff;
    color: #ff00ff;
    transition: all 0.3s;
    letter-spacing: 2px;
  }

  .cyber-card:hover .cyber-button {
    background: #ff00ff;
    color: #0a0a0a;
    box-shadow: 0 0 20px #ff00ff;
  }
</style>
