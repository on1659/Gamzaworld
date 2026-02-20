<!-- Style 9: Glassmorphism - 투명 유리 효과 -->
<script>
  export let games;
  export let onStartGame;
</script>

<div class="lobby-style-9">
  <div class="gradient-bg"></div>
  <div class="blur-orbs">
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>
  </div>
  
  <header class="header">
    <div class="glass-header">
      <h1 class="title">Select Your Game</h1>
      <p class="subtitle">Choose wisely, play boldly</p>
    </div>
  </header>

  <div class="games-grid">
    {#each games as game}
      <button class="glass-card" on:click={() => onStartGame(game.id)}>
        <div class="card-shine"></div>
        <div class="game-emoji">{game.emoji}</div>
        <h3 class="game-name">{game.name}</h3>
        <p class="game-desc">{game.description}</p>
        <div class="difficulty-pill {game.difficulty}">
          <span class="pill-dot"></span>
          {game.difficulty}
        </div>
      </button>
    {/each}
  </div>
</div>

<style>
  .lobby-style-9 {
    position: relative;
    min-height: 100vh;
    padding: clamp(40px, 8vh, 80px) clamp(20px, 4vw, 60px);
    overflow: hidden;
  }

  /* 그라디언트 배경 */
  .gradient-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg,
      #667eea 0%,
      #764ba2 25%,
      #f093fb 50%,
      #4facfe 75%,
      #00f2fe 100%
    );
    background-size: 400% 400%;
    animation: gradientShift 15s ease infinite;
    z-index: 0;
  }

  /* 블러 오브 */
  .blur-orbs {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 1;
  }

  .orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.5;
    animation: float 20s ease-in-out infinite;
  }

  .orb-1 {
    width: clamp(200px, 40vw, 400px);
    height: clamp(200px, 40vw, 400px);
    background: radial-gradient(circle, rgba(255, 107, 157, 0.6) 0%, transparent 70%);
    top: 10%;
    left: 10%;
    animation-delay: 0s;
  }

  .orb-2 {
    width: clamp(250px, 50vw, 500px);
    height: clamp(250px, 50vw, 500px);
    background: radial-gradient(circle, rgba(107, 207, 127, 0.6) 0%, transparent 70%);
    bottom: 20%;
    right: 10%;
    animation-delay: 5s;
  }

  .orb-3 {
    width: clamp(180px, 36vw, 360px);
    height: clamp(180px, 36vw, 360px);
    background: radial-gradient(circle, rgba(78, 205, 196, 0.6) 0%, transparent 70%);
    top: 50%;
    left: 50%;
    animation-delay: 10s;
  }

  .header {
    position: relative;
    text-align: center;
    margin-bottom: clamp(40px, 6vh, 64px);
    z-index: 2;
  }

  .glass-header {
    display: inline-block;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border-radius: 24px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    padding: clamp(24px, 4vw, 40px) clamp(32px, 6vw, 64px);
    box-shadow:
      0 8px 32px 0 rgba(31, 38, 135, 0.37),
      inset 0 1px 0 0 rgba(255, 255, 255, 0.5);
  }

  .title {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: clamp(32px, 6vw, 56px);
    font-weight: 700;
    color: rgba(255, 255, 255, 0.95);
    margin-bottom: var(--spacing-sm);
    text-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
  }

  .subtitle {
    font-size: clamp(14px, 2.5vw, 18px);
    color: rgba(255, 255, 255, 0.8);
    font-weight: 500;
  }

  .games-grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
    gap: clamp(20px, 3vw, 32px);
    max-width: 1400px;
    margin: 0 auto;
    z-index: 2;
  }

  .glass-card {
    position: relative;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(16px) saturate(180%);
    -webkit-backdrop-filter: blur(16px) saturate(180%);
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    padding: clamp(24px, 4vw, 32px);
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    overflow: hidden;
    box-shadow:
      0 8px 32px 0 rgba(31, 38, 135, 0.2),
      inset 0 1px 0 0 rgba(255, 255, 255, 0.4);
  }

  .card-shine {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transition: left 0.5s;
  }

  .glass-card:hover .card-shine {
    left: 100%;
  }

  .glass-card:hover {
    transform: translateY(-12px) scale(1.02);
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.5);
    box-shadow:
      0 16px 48px 0 rgba(31, 38, 135, 0.3),
      inset 0 1px 0 0 rgba(255, 255, 255, 0.6);
  }

  .game-emoji {
    font-size: clamp(56px, 12vw, 80px);
    text-align: center;
    margin-bottom: var(--spacing-md);
    filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2));
  }

  .game-name {
    font-size: clamp(20px, 4vw, 28px);
    font-weight: 700;
    color: rgba(255, 255, 255, 0.95);
    text-align: center;
    margin-bottom: var(--spacing-sm);
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .game-desc {
    font-size: clamp(13px, 2.5vw, 15px);
    color: rgba(255, 255, 255, 0.8);
    text-align: center;
    margin-bottom: var(--spacing-md);
    line-height: 1.6;
  }

  .difficulty-pill {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-xs);
    padding: var(--spacing-xs) var(--spacing-md);
    border-radius: 20px;
    font-size: clamp(12px, 2.5vw, 14px);
    font-weight: 600;
    text-transform: capitalize;
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }

  .pill-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    animation: pulse 2s ease-in-out infinite;
  }

  .difficulty-pill.easy {
    background: rgba(107, 207, 127, 0.3);
    color: rgba(255, 255, 255, 0.95);
  }

  .difficulty-pill.easy .pill-dot {
    background: #6bcf7f;
    box-shadow: 0 0 8px #6bcf7f;
  }

  .difficulty-pill.normal {
    background: rgba(255, 217, 61, 0.3);
    color: rgba(255, 255, 255, 0.95);
  }

  .difficulty-pill.normal .pill-dot {
    background: #ffd93d;
    box-shadow: 0 0 8px #ffd93d;
  }

  .difficulty-pill.hard {
    background: rgba(255, 107, 157, 0.3);
    color: rgba(255, 255, 255, 0.95);
  }

  .difficulty-pill.hard .pill-dot {
    background: #ff6b9d;
    box-shadow: 0 0 8px #ff6b9d;
  }

  @keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }

  @keyframes float {
    0%, 100% {
      transform: translate(0, 0) rotate(0deg);
    }
    33% {
      transform: translate(30px, -30px) rotate(120deg);
    }
    66% {
      transform: translate(-20px, 20px) rotate(240deg);
    }
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.7;
    }
  }

  @media (max-width: 768px) {
    .lobby-style-9 {
      padding: clamp(32px, 6vh, 64px) var(--spacing-md);
    }

    .games-grid {
      gap: var(--spacing-md);
    }
  }

  @media (max-width: 480px) {
    .games-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
