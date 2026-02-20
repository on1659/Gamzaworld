<!-- Style 10: Gradient Animation - 흐르는 무지개 그라디언트 -->
<script>
  export let games;
  export let onStartGame;
</script>

<div class="lobby-style-10">
  <div class="animated-bg">
    <div class="gradient-layer layer-1"></div>
    <div class="gradient-layer layer-2"></div>
    <div class="gradient-layer layer-3"></div>
  </div>
  
  <header class="header">
    <h1 class="gradient-title">
      <span class="word">GAME</span>
      <span class="word">WORLD</span>
    </h1>
    <p class="tagline">Experience the rainbow</p>
  </header>

  <div class="games-flow">
    {#each games as game, index}
      <button 
        class="flow-card" 
        on:click={() => onStartGame(game.id)}
        style="--index: {index}"
      >
        <div class="card-gradient"></div>
        <div class="card-content">
          <div class="emoji-wrapper">
            <div class="emoji">{game.emoji}</div>
          </div>
          <h3 class="name">{game.name}</h3>
          <p class="desc">{game.description}</p>
          <div class="meta">
            <div class="difficulty-bar {game.difficulty}">
              <div class="bar-fill"></div>
            </div>
            <span class="difficulty-label">
              {game.difficulty === 'easy' ? 'Easy' : game.difficulty === 'normal' ? 'Normal' : 'Hard'}
            </span>
          </div>
        </div>
      </button>
    {/each}
  </div>
</div>

<style>
  .lobby-style-10 {
    position: relative;
    min-height: 100vh;
    padding: clamp(40px, 8vh, 80px) clamp(20px, 4vw, 60px);
    overflow: hidden;
  }

  /* 레이어드 그라디언트 배경 */
  .animated-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }

  .gradient-layer {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0.8;
  }

  .layer-1 {
    background: linear-gradient(
      45deg,
      #ff6b9d 0%,
      #c44569 20%,
      #1e3c72 40%,
      #2a5298 60%,
      #0ba360 80%,
      #3cba92 100%
    );
    background-size: 400% 400%;
    animation: gradientFlow1 20s ease infinite;
  }

  .layer-2 {
    background: linear-gradient(
      -45deg,
      #ffa751 0%,
      #ffe259 20%,
      #ee9ca7 40%,
      #ffdde1 60%,
      #667eea 80%,
      #764ba2 100%
    );
    background-size: 400% 400%;
    animation: gradientFlow2 25s ease infinite;
    mix-blend-mode: multiply;
  }

  .layer-3 {
    background: linear-gradient(
      135deg,
      #667eea 0%,
      #764ba2 20%,
      #f093fb 40%,
      #4facfe 60%,
      #00f2fe 80%,
      #43e97b 100%
    );
    background-size: 400% 400%;
    animation: gradientFlow3 30s ease infinite;
    mix-blend-mode: screen;
    opacity: 0.4;
  }

  .header {
    position: relative;
    text-align: center;
    margin-bottom: clamp(48px, 8vh, 80px);
    z-index: 2;
  }

  .gradient-title {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: clamp(8px, 1.5vw, 16px);
    margin-bottom: var(--spacing-md);
  }

  .word {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: clamp(48px, 12vw, 96px);
    font-weight: 900;
    letter-spacing: -0.05em;
    background: linear-gradient(
      90deg,
      #ff6b9d 0%,
      #ffa751 20%,
      #ffe259 40%,
      #667eea 60%,
      #f093fb 80%,
      #4facfe 100%
    );
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gradientText 3s linear infinite;
    filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.2));
  }

  .tagline {
    font-size: clamp(14px, 3vw, 20px);
    font-weight: 500;
    color: rgba(255, 255, 255, 0.9);
    text-transform: uppercase;
    letter-spacing: 0.3em;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }

  .games-flow {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
    gap: clamp(24px, 4vw, 40px);
    max-width: 1400px;
    margin: 0 auto;
    z-index: 2;
  }

  .flow-card {
    position: relative;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 24px;
    padding: 0;
    cursor: pointer;
    border: 2px solid rgba(255, 255, 255, 0.2);
    overflow: hidden;
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    animation: cardFadeIn 0.6s ease calc(var(--index) * 0.1s) backwards;
  }

  .card-gradient {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      135deg,
      rgba(255, 107, 157, 0.6) 0%,
      rgba(255, 167, 81, 0.6) 25%,
      rgba(102, 126, 234, 0.6) 50%,
      rgba(240, 147, 251, 0.6) 75%,
      rgba(79, 172, 254, 0.6) 100%
    );
    background-size: 400% 400%;
    opacity: 0;
    transition: opacity 0.5s;
    animation: gradientRotate 8s ease infinite;
  }

  .flow-card:hover .card-gradient {
    opacity: 1;
  }

  .flow-card:hover {
    transform: translateY(-16px) scale(1.05);
    border-color: rgba(255, 255, 255, 0.5);
    box-shadow: 
      0 20px 60px rgba(0, 0, 0, 0.3),
      0 0 40px rgba(255, 255, 255, 0.2);
  }

  .card-content {
    position: relative;
    padding: clamp(24px, 4vw, 40px);
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(20px);
    border-radius: 22px;
  }

  .emoji-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: var(--spacing-md);
  }

  .emoji {
    font-size: clamp(64px, 12vw, 96px);
    filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
    animation: emojiFloat 3s ease-in-out infinite;
  }

  .name {
    font-size: clamp(24px, 4vw, 32px);
    font-weight: 800;
    color: #fff;
    text-align: center;
    margin-bottom: var(--spacing-sm);
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
  }

  .desc {
    font-size: clamp(13px, 2.5vw, 16px);
    color: rgba(255, 255, 255, 0.85);
    text-align: center;
    margin-bottom: var(--spacing-lg);
    line-height: 1.6;
  }

  .meta {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    align-items: center;
  }

  .difficulty-bar {
    width: 100%;
    height: 8px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    overflow: hidden;
    position: relative;
  }

  .bar-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.5s ease;
    animation: barGlow 2s ease-in-out infinite;
  }

  .difficulty-bar.easy .bar-fill {
    width: 33%;
    background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);
  }

  .difficulty-bar.normal .bar-fill {
    width: 66%;
    background: linear-gradient(90deg, #fa709a 0%, #fee140 100%);
  }

  .difficulty-bar.hard .bar-fill {
    width: 100%;
    background: linear-gradient(90deg, #f093fb 0%, #f5576c 100%);
  }

  .difficulty-label {
    font-size: clamp(11px, 2vw, 13px);
    font-weight: 600;
    color: rgba(255, 255, 255, 0.9);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  @keyframes gradientFlow1 {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }

  @keyframes gradientFlow2 {
    0%, 100% { background-position: 100% 50%; }
    50% { background-position: 0% 50%; }
  }

  @keyframes gradientFlow3 {
    0%, 100% { background-position: 50% 0%; }
    50% { background-position: 50% 100%; }
  }

  @keyframes gradientText {
    0% { background-position: 0% center; }
    100% { background-position: 200% center; }
  }

  @keyframes gradientRotate {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }

  @keyframes emojiFloat {
    0%, 100% {
      transform: translateY(0) rotate(0deg);
    }
    50% {
      transform: translateY(-10px) rotate(5deg);
    }
  }

  @keyframes cardFadeIn {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes barGlow {
    0%, 100% {
      box-shadow: 0 0 10px currentColor;
    }
    50% {
      box-shadow: 0 0 20px currentColor;
    }
  }

  @media (max-width: 768px) {
    .lobby-style-10 {
      padding: clamp(32px, 6vh, 64px) var(--spacing-md);
    }

    .games-flow {
      gap: var(--spacing-lg);
    }

    .gradient-title {
      gap: var(--spacing-xs);
    }
  }

  @media (max-width: 480px) {
    .games-flow {
      grid-template-columns: 1fr;
    }
  }
</style>
