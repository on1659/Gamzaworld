<script>
  const games = [
    { id: 1, emoji: '🏃', name: '타이밍 점프', color: '#FFB3D9' },
    { id: 2, emoji: '🎵', name: '리듬 탭', color: '#B3E5FF' },
    { id: 3, emoji: '🏗️', name: '스택 타워', color: '#FFE5B3' },
  ];

  function playGame(id) {
    alert(`게임 ${id} 준비 중! 🎮`);
  }
</script>

<div class="lobby">
  <!-- 타이틀 -->
  <div class="title-container">
    <h1 class="title">
      <span class="bubble">🎮</span>
      감자월드
    </h1>
    <p class="subtitle">재미있는 게임을 골라봐요!</p>
  </div>

  <!-- 게임 카드들 -->
  <div class="games">
    {#each games as game}
      <button 
        class="game-card" 
        style="--card-color: {game.color}"
        on:click={() => playGame(game.id)}
      >
        <div class="game-emoji">{game.emoji}</div>
        <div class="game-name">{game.name}</div>
        <div class="play-icon">▶</div>
      </button>
    {/each}
  </div>
</div>

<style>
  .lobby {
    width: 100%;
    max-width: 600px;
    padding: 40px 20px;
    text-align: center;
  }

  /* 타이틀 */
  .title-container {
    margin-bottom: 48px;
    animation: fadeInDown 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .title {
    font-size: clamp(36px, 8vw, 56px);
    font-weight: 900;
    color: #ff6b9d;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
  }

  .bubble {
    display: inline-block;
    font-size: clamp(40px, 9vw, 64px);
    animation: bounce 2s ease-in-out infinite;
  }

  .subtitle {
    font-size: clamp(16px, 3.5vw, 20px);
    color: #8b5a8e;
    font-weight: 600;
  }

  /* 게임 카드 그리드 */
  .games {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 160px), 1fr));
    gap: 24px;
  }

  .game-card {
    position: relative;
    background: var(--card-color);
    border: none;
    border-radius: 32px;
    padding: 32px 24px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 
      0 8px 24px rgba(0, 0, 0, 0.1),
      0 0 0 4px rgba(255, 255, 255, 0.3);
    animation: fadeInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
  }

  .game-card:nth-child(1) { animation-delay: 0.1s; }
  .game-card:nth-child(2) { animation-delay: 0.2s; }
  .game-card:nth-child(3) { animation-delay: 0.3s; }

  .game-card:hover {
    transform: translateY(-12px) scale(1.05);
    box-shadow: 
      0 16px 48px rgba(0, 0, 0, 0.15),
      0 0 0 6px rgba(255, 255, 255, 0.5);
  }

  .game-card:active {
    transform: translateY(-8px) scale(1.02);
  }

  .game-emoji {
    font-size: clamp(56px, 12vw, 80px);
    margin-bottom: 12px;
    animation: wiggle 1.5s ease-in-out infinite;
  }

  .game-card:hover .game-emoji {
    animation: spin 0.6s ease-in-out;
  }

  .game-name {
    font-size: clamp(18px, 4vw, 22px);
    font-weight: 800;
    color: #2d1b4e;
    margin-bottom: 8px;
  }

  .play-icon {
    font-size: 24px;
    color: #ffffff;
    background: rgba(255, 255, 255, 0.3);
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 12px auto 0;
    transition: all 0.3s;
  }

  .game-card:hover .play-icon {
    background: rgba(255, 255, 255, 0.5);
    transform: scale(1.2);
  }

  /* 애니메이션 */
  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @keyframes wiggle {
    0%, 100% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(-5deg);
    }
    75% {
      transform: rotate(5deg);
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /* 반응형 */
  @media (max-width: 480px) {
    .lobby {
      padding: 24px 16px;
    }

    .games {
      grid-template-columns: 1fr;
    }
  }
</style>
