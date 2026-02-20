<!-- Style 11: Landing Page - 커피챗 스타일 화이트 랜딩 페이지 -->
<script>
  export let games;
  export let onStartGame;
  
  const badges = {
    'timing-jump': { text: '추천', type: 'recommend' },
    'rhythm-tap': { text: '인기', type: 'popular' },
    'stack-tower': { text: '도전', type: 'challenge' }
  };
</script>

<div class="lobby-style-11">
  <!-- Hero Section -->
  <section class="hero">
    <div class="hero-content">
      <div class="label">GAMZAWORLD</div>
      <h1 class="hero-title">
        게임을 선택하고<br/>
        도전을 시작하세요
      </h1>
      <p class="hero-desc">
        간단한 터치만으로 즐기는 캐주얼 게임.<br/>
        지금 바로 플레이해보세요.
      </p>
    </div>
  </section>

  <!-- Features Section -->
  <section class="features">
    <div class="feature-grid">
      <div class="feature-item">
        <div class="feature-emoji">⚡</div>
        <h3>빠른 시작</h3>
        <p>복잡한 설치 없이<br/>즉시 플레이</p>
      </div>
      <div class="feature-item">
        <div class="feature-emoji">🎮</div>
        <h3>간편 조작</h3>
        <p>직관적인 컨트롤로<br/>누구나 쉽게</p>
      </div>
      <div class="feature-item">
        <div class="feature-emoji">🏆</div>
        <h3>도전 과제</h3>
        <p>난이도별 다양한<br/>재미 요소</p>
      </div>
    </div>
  </section>

  <!-- Games Section -->
  <section class="games-section">
    <div class="section-header">
      <h2 class="section-title">어떤 게임을 할까요?</h2>
      <p class="section-desc">난이도별로 골라보세요</p>
    </div>

    <div class="pricing-cards">
      {#each games as game}
        <div class="pricing-card">
          {#if badges[game.id]}
            <div class="badge {badges[game.id].type}">
              {badges[game.id].text}
            </div>
          {/if}
          
          <div class="card-header">
            <div class="game-emoji">{game.emoji}</div>
            <h3 class="game-name">{game.name}</h3>
            <p class="game-desc">{game.description}</p>
          </div>

          <div class="difficulty-section">
            <div class="difficulty-label">난이도</div>
            <div class="difficulty-stars {game.difficulty}">
              {#if game.difficulty === 'easy'}
                ⭐
              {:else if game.difficulty === 'normal'}
                ⭐⭐
              {:else}
                ⭐⭐⭐
              {/if}
            </div>
          </div>

          <ul class="feature-list">
            <li>빠른 반응 필요</li>
            <li>중독성 있는 플레이</li>
            <li>랭킹 시스템</li>
          </ul>

          <button class="start-button" on:click={() => onStartGame(game.id)}>
            시작하기
          </button>
        </div>
      {/each}
    </div>
  </section>

  <!-- CTA Section -->
  <section class="cta-section">
    <div class="cta-content">
      <h2 class="cta-title">지금 바로 시작하세요</h2>
      <p class="cta-desc">무료로 즐기는 캐주얼 게임</p>
    </div>
  </section>
</div>

<style>
  .lobby-style-11 {
    min-height: 100vh;
    background: #ffffff;
  }

  /* Hero Section */
  .hero {
    padding: clamp(60px, 12vh, 120px) clamp(20px, 5vw, 60px);
    text-align: center;
    border-bottom: 1px solid #e5e7eb;
  }

  .hero-content {
    max-width: 800px;
    margin: 0 auto;
  }

  .label {
    display: inline-block;
    padding: 6px 16px;
    background: #000;
    color: #fff;
    font-size: clamp(11px, 2vw, 13px);
    font-weight: 700;
    letter-spacing: 0.1em;
    border-radius: 20px;
    margin-bottom: clamp(20px, 4vh, 32px);
  }

  .hero-title {
    font-size: clamp(32px, 7vw, 56px);
    font-weight: 800;
    line-height: 1.2;
    color: #111827;
    margin-bottom: clamp(16px, 3vh, 24px);
    letter-spacing: -0.02em;
  }

  .hero-desc {
    font-size: clamp(16px, 3vw, 20px);
    line-height: 1.7;
    color: #6b7280;
    margin-bottom: clamp(32px, 6vh, 48px);
  }

  /* Features Section */
  .features {
    padding: clamp(60px, 10vh, 80px) clamp(20px, 5vw, 60px);
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
  }

  .feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr));
    gap: clamp(32px, 5vw, 48px);
    max-width: 1000px;
    margin: 0 auto;
  }

  .feature-item {
    text-align: center;
  }

  .feature-emoji {
    font-size: clamp(40px, 8vw, 56px);
    margin-bottom: var(--spacing-md);
  }

  .feature-item h3 {
    font-size: clamp(18px, 3.5vw, 22px);
    font-weight: 700;
    color: #111827;
    margin-bottom: var(--spacing-xs);
  }

  .feature-item p {
    font-size: clamp(14px, 2.5vw, 16px);
    color: #6b7280;
    line-height: 1.6;
  }

  /* Games Section */
  .games-section {
    padding: clamp(60px, 12vh, 100px) clamp(20px, 5vw, 60px);
  }

  .section-header {
    text-align: center;
    margin-bottom: clamp(48px, 8vh, 64px);
  }

  .section-title {
    font-size: clamp(32px, 6vw, 48px);
    font-weight: 800;
    color: #111827;
    margin-bottom: var(--spacing-sm);
    letter-spacing: -0.02em;
  }

  .section-desc {
    font-size: clamp(16px, 3vw, 18px);
    color: #6b7280;
  }

  .pricing-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
    gap: clamp(24px, 4vw, 32px);
    max-width: 1200px;
    margin: 0 auto;
  }

  .pricing-card {
    position: relative;
    background: #ffffff;
    border: 2px solid #e5e7eb;
    border-radius: 16px;
    padding: clamp(32px, 5vw, 40px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .pricing-card:hover {
    border-color: #111827;
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }

  .badge {
    position: absolute;
    top: 16px;
    right: 16px;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: clamp(11px, 2vw, 12px);
    font-weight: 700;
    letter-spacing: 0.05em;
  }

  .badge.recommend {
    background: #dbeafe;
    color: #1e40af;
  }

  .badge.popular {
    background: #fef3c7;
    color: #92400e;
  }

  .badge.challenge {
    background: #fee2e2;
    color: #991b1b;
  }

  .card-header {
    text-align: center;
    padding-bottom: clamp(24px, 4vh, 32px);
    border-bottom: 1px solid #e5e7eb;
    margin-bottom: clamp(24px, 4vh, 32px);
  }

  .game-emoji {
    font-size: clamp(56px, 12vw, 80px);
    margin-bottom: var(--spacing-md);
  }

  .game-name {
    font-size: clamp(24px, 4.5vw, 32px);
    font-weight: 800;
    color: #111827;
    margin-bottom: var(--spacing-sm);
  }

  .game-desc {
    font-size: clamp(14px, 2.5vw, 16px);
    color: #6b7280;
    line-height: 1.6;
  }

  .difficulty-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-md) 0;
    margin-bottom: var(--spacing-lg);
  }

  .difficulty-label {
    font-size: clamp(13px, 2.5vw, 14px);
    font-weight: 600;
    color: #6b7280;
  }

  .difficulty-stars {
    font-size: clamp(16px, 3vw, 18px);
  }

  .difficulty-stars.easy { color: #10b981; }
  .difficulty-stars.normal { color: #f59e0b; }
  .difficulty-stars.hard { color: #ef4444; }

  .feature-list {
    list-style: none;
    padding: 0;
    margin: 0 0 clamp(24px, 4vh, 32px) 0;
  }

  .feature-list li {
    padding: var(--spacing-sm) 0;
    font-size: clamp(14px, 2.5vw, 15px);
    color: #374151;
    position: relative;
    padding-left: 24px;
  }

  .feature-list li::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: #10b981;
    font-weight: bold;
  }

  .start-button {
    width: 100%;
    padding: clamp(14px, 2.5vh, 18px) clamp(24px, 4vw, 32px);
    background: #111827;
    color: #ffffff;
    border: none;
    border-radius: 12px;
    font-size: clamp(15px, 3vw, 17px);
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
  }

  .start-button:hover {
    background: #000000;
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  .start-button:active {
    transform: translateY(0);
  }

  /* CTA Section */
  .cta-section {
    padding: clamp(80px, 12vh, 120px) clamp(20px, 5vw, 60px);
    text-align: center;
    background: #f9fafb;
    border-top: 1px solid #e5e7eb;
  }

  .cta-content {
    max-width: 600px;
    margin: 0 auto;
  }

  .cta-title {
    font-size: clamp(28px, 6vw, 42px);
    font-weight: 800;
    color: #111827;
    margin-bottom: var(--spacing-md);
    letter-spacing: -0.02em;
  }

  .cta-desc {
    font-size: clamp(16px, 3vw, 20px);
    color: #6b7280;
    line-height: 1.7;
  }

  @media (max-width: 768px) {
    .hero {
      padding: clamp(48px, 10vh, 80px) var(--spacing-md);
    }

    .features {
      padding: clamp(48px, 8vh, 64px) var(--spacing-md);
    }

    .games-section {
      padding: clamp(48px, 10vh, 80px) var(--spacing-md);
    }

    .pricing-cards {
      grid-template-columns: 1fr;
      gap: var(--spacing-lg);
    }

    .cta-section {
      padding: clamp(60px, 10vh, 80px) var(--spacing-md);
    }
  }
</style>
