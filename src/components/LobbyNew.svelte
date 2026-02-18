<script>
  import { currentPage, currentGame } from '../stores.js';

  const games = [
    {
      id: 'timing-jump',
      name: '타이밍 점프',
      description: '장애물을 피하며 최대한 멀리!',
      emoji: '🏃',
      difficulty: 'easy',
      color: 'accent-1'
    },
    {
      id: 'rhythm-tap',
      name: '리듬 탭',
      description: '떨어지는 노트를 정확히 터치!',
      emoji: '🎵',
      difficulty: 'normal',
      color: 'accent-2'
    },
    {
      id: 'stack-tower',
      name: '스택 타워',
      description: '타이밍 맞춰 블록 쌓기!',
      emoji: '🏗️',
      difficulty: 'hard',
      color: 'accent-3'
    }
  ];

  // Mock 통계 (추후 API 연동)
  const stats = {
    onlinePlayers: 1234,
    totalPlays: 45678,
    gamesAvailable: games.length
  };

  async function startGame(gameId) {
    try {
      let GameComponent;
      
      if (gameId === 'timing-jump') {
        const module = await import('../games/timing-jump/TimingJump.svelte');
        GameComponent = module.default;
      } else {
        alert(`${gameId} 준비 중이에요! 🚧`);
        return;
      }
      
      currentGame.set(GameComponent);
      currentPage.set('game');
    } catch (error) {
      console.error('게임 로드 실패:', error);
      alert('게임을 불러올 수 없어요 😢');
    }
  }
</script>

<div class="lobby">
  <!-- 헤더 영역 -->
  <header class="lobby-header">
    <div class="header-title">
      <h1 class="title">게임을 선택하세요!</h1>
      <p class="subtitle">어떤 게임으로 실력을 뽐낼까요? 💪</p>
    </div>
    
    <!-- 장식 요소 -->
    <div class="header-decoration">
      <span class="deco-star">⭐</span>
      <span class="deco-star">✨</span>
      <span class="deco-star">💫</span>
    </div>
  </header>

  <!-- 게임 그리드 -->
  <section class="games-section">
    <div class="games-grid">
      {#each games as game}
        <article class="game-card" data-color={game.color}>
          <!-- 게임 아이콘 -->
          <div class="game-icon">
            <span class="icon-emoji">{game.emoji}</span>
          </div>

          <!-- 게임 정보 -->
          <div class="game-info">
            <h3 class="game-name">{game.name}</h3>
            <p class="game-desc">{game.description}</p>
          </div>

          <!-- 난이도 뱃지 -->
          <div class="game-meta">
            <span class="difficulty-badge difficulty-{game.difficulty}">
              {#if game.difficulty === 'easy'}
                😊 쉬움
              {:else if game.difficulty === 'normal'}
                🤔 보통
              {:else}
                🔥 어려움
              {/if}
            </span>
          </div>

          <!-- 플레이 버튼 -->
          <button 
            class="game-play-btn"
            on:click={() => startGame(game.id)}
          >
            <span class="btn-icon">🎮</span>
            <span class="btn-text">플레이!</span>
          </button>
        </article>
      {/each}
    </div>
  </section>

  <!-- 통계 배너 -->
  <section class="stats-banner">
    <div class="stat-item">
      <div class="stat-icon">👥</div>
      <div class="stat-content">
        <div class="stat-value">{stats.onlinePlayers.toLocaleString()}</div>
        <div class="stat-label">명이 플레이 중</div>
      </div>
    </div>

    <div class="stat-divider"></div>

    <div class="stat-item">
      <div class="stat-icon">🎲</div>
      <div class="stat-content">
        <div class="stat-value">{stats.totalPlays.toLocaleString()}</div>
        <div class="stat-label">전체 플레이 횟수</div>
      </div>
    </div>

    <div class="stat-divider"></div>

    <div class="stat-item">
      <div class="stat-icon">🏆</div>
      <div class="stat-content">
        <div class="stat-value">{stats.gamesAvailable}</div>
        <div class="stat-label">가지 게임</div>
      </div>
    </div>
  </section>
</div>

<style>
  /* 모든 스타일은 theme.css의 CSS Variables 사용 */
  
  .lobby {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--spacing-xl);
  }

  /* ===== 헤더 ===== */
  
  .lobby-header {
    position: relative;
    text-align: center;
    margin-bottom: var(--spacing-2xl);
  }

  .title {
    font-family: var(--font-display);
    font-size: var(--font-size-3xl);
    color: var(--color-primary);
    margin-bottom: var(--spacing-sm);
    text-shadow: 3px 3px 0 var(--color-border-primary);
  }

  .subtitle {
    font-size: var(--font-size-lg);
    color: var(--color-text-secondary);
  }

  .header-decoration {
    display: flex;
    justify-content: center;
    gap: var(--spacing-lg);
    margin-top: var(--spacing-md);
  }

  .deco-star {
    font-size: var(--font-size-2xl);
    animation: bounceFloat 2s ease-in-out infinite;
  }

  .deco-star:nth-child(2) {
    animation-delay: 0.3s;
  }

  .deco-star:nth-child(3) {
    animation-delay: 0.6s;
  }

  /* ===== 게임 그리드 ===== */

  .games-section {
    margin-bottom: var(--spacing-2xl);
  }

  .games-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--spacing-lg);
  }

  .game-card {
    background: var(--color-bg-secondary);
    border: var(--border-width-thick) solid var(--color-border-primary);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-lg);
    box-shadow: var(--shadow-md);
    transition: all var(--duration-normal) cubic-bezier(0.34, 1.56, 0.64, 1);
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  /* 게임별 색상 액센트 */
  .game-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 6px;
    background: var(--color-accent-1);
  }

  .game-card[data-color="accent-2"]::before {
    background: var(--color-accent-2);
  }

  .game-card[data-color="accent-3"]::before {
    background: var(--color-accent-3);
  }

  .game-card:hover {
    transform: translateY(-8px) rotate(1deg);
    box-shadow: var(--shadow-lg);
  }

  /* 게임 아이콘 */
  .game-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto var(--spacing-md);
    background: var(--color-bg-primary);
    border: var(--border-width-medium) solid var(--color-border-primary);
    border-radius: var(--border-radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform var(--duration-normal);
  }

  .game-card:hover .game-icon {
    animation: wiggle 0.5s;
  }

  .icon-emoji {
    font-size: 48px;
  }

  /* 게임 정보 */
  .game-info {
    text-align: center;
    margin-bottom: var(--spacing-md);
  }

  .game-name {
    font-family: var(--font-display);
    font-size: var(--font-size-xl);
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-xs);
  }

  .game-desc {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    line-height: 1.5;
  }

  /* 난이도 뱃지 */
  .game-meta {
    display: flex;
    justify-content: center;
    margin-bottom: var(--spacing-md);
  }

  .difficulty-badge {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-xs);
    padding: var(--spacing-xs) var(--spacing-md);
    border: var(--border-width-thin) solid var(--color-border-primary);
    border-radius: var(--border-radius-full);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-semibold);
  }

  .difficulty-easy {
    background: var(--color-accent-1);
    color: white;
  }

  .difficulty-normal {
    background: var(--color-secondary);
    color: var(--color-text-primary);
  }

  .difficulty-hard {
    background: var(--color-primary);
    color: white;
  }

  /* 플레이 버튼 */
  .game-play-btn {
    width: 100%;
    padding: var(--spacing-md);
    background: var(--color-primary);
    color: var(--color-text-white);
    border: var(--border-width-thick) solid var(--color-border-primary);
    border-radius: var(--border-radius-md);
    font-family: var(--font-display);
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-bold);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    transition: all var(--duration-normal) cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .game-play-btn:hover {
    background: var(--color-primary-dark);
    transform: scale(1.05);
    box-shadow: var(--shadow-colored);
  }

  .game-play-btn:active {
    animation: elasticBounce var(--duration-normal);
  }

  .btn-icon {
    font-size: var(--font-size-xl);
  }

  /* ===== 통계 배너 ===== */

  .stats-banner {
    background: var(--color-secondary);
    border: var(--border-width-thick) solid var(--color-border-primary);
    border-radius: var(--border-radius-xl);
    padding: var(--spacing-xl);
    box-shadow: var(--shadow-lg);
    display: flex;
    justify-content: space-around;
    align-items: center;
    gap: var(--spacing-lg);
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
  }

  .stat-icon {
    font-size: var(--font-size-3xl);
    animation: bounceFloat 3s ease-in-out infinite;
  }

  .stat-content {
    text-align: left;
  }

  .stat-value {
    font-family: var(--font-display);
    font-size: var(--font-size-2xl);
    color: var(--color-text-primary);
    font-weight: var(--font-weight-bold);
  }

  .stat-label {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
  }

  .stat-divider {
    width: 2px;
    height: 60px;
    background: var(--color-border-primary);
  }

  /* ===== 반응형 ===== */

  @media (max-width: 768px) {
    .lobby {
      padding: var(--spacing-md);
    }

    .games-grid {
      grid-template-columns: 1fr;
    }

    .stats-banner {
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .stat-divider {
      width: 80%;
      height: 2px;
    }

    .title {
      font-size: var(--font-size-2xl);
    }
  }
</style>
