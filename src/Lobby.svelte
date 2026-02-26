<script>
  export let onPlay = () => {};

  const games = [
    { id: 'timing-jump', emoji: '🏃', name: '타이밍 점프', color: '#FFB3D9', available: true },
    { id: 'rhythm-tap',  emoji: '🎵', name: '리듬 탭',    color: '#B3E5FF', available: true },
    { id: 'stack-tower', emoji: '🏗️', name: '스택 타워',  color: '#FFE5B3', available: true },
  ];

  let activeTab = 'games'; // 'games' | 'rankings'
  let rankings = [];
  let rankingsLoaded = false;
  let rankingsLoading = false;

  function playGame(game) {
    if (!game.available) return;
    onPlay(game.id);
  }

  async function loadRankings() {
    if (rankingsLoaded) return;
    rankingsLoading = true;
    try {
      const res = await fetch('/api/rankings/timing-jump');
      const data = await res.json();
      rankings = data.rankings || [];
    } catch (e) {
      rankings = [];
    } finally {
      rankingsLoading = false;
      rankingsLoaded = true;
    }
  }

  function switchTab(tab) {
    activeTab = tab;
    if (tab === 'rankings') loadRankings();
  }

  function tierEmoji(tier) {
    const map = { bronze: '🥉', silver: '🥈', gold: '🥇', diamond: '💎' };
    return map[tier] || '';
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

  <!-- 탭 -->
  <div class="tabs">
    <button class="tab" class:active={activeTab === 'games'} on:click={() => switchTab('games')}>
      🕹 게임
    </button>
    <button class="tab" class:active={activeTab === 'rankings'} on:click={() => switchTab('rankings')}>
      🏆 랭킹
    </button>
  </div>

  <!-- 게임 탭 -->
  {#if activeTab === 'games'}
    <div class="games">
      {#each games as game}
        <button
          class="game-card"
          class:unavailable={!game.available}
          style="--card-color: {game.color}"
          on:click={() => playGame(game)}
          disabled={!game.available}
          title={game.available ? '' : '준비 중...'}
        >
          {#if !game.available}
            <div class="coming-soon-badge">준비 중</div>
          {/if}
          <div class="game-emoji">{game.emoji}</div>
          <div class="game-name">{game.name}</div>
          {#if game.available}
            <div class="play-icon">▶</div>
          {:else}
            <div class="play-icon soon">🔒</div>
          {/if}
        </button>
      {/each}
    </div>
  {/if}

  <!-- 랭킹 탭 -->
  {#if activeTab === 'rankings'}
    <div class="rankings-panel">
      <div class="ranking-game-label">🏃 타이밍 점프 Top 10</div>

      {#if rankingsLoading}
        <div class="rank-loading">불러오는 중...</div>
      {:else if rankings.length === 0}
        <div class="rank-empty">
          <div class="rank-empty-icon">🏆</div>
          <p>아직 기록이 없어요!</p>
          <p class="rank-empty-sub">첫 번째 랭커가 되어보세요 🎯</p>
        </div>
      {:else}
        <ol class="rank-list">
          {#each rankings as entry, i}
            <li class="rank-item" class:top3={i < 3}>
              <span class="rank-num">
                {#if i === 0}🥇{:else if i === 1}🥈{:else if i === 2}🥉{:else}{i + 1}{/if}
              </span>
              <span class="rank-name">
                {entry.username || entry.player_name}{tierEmoji(entry.tier) ? ' ' + tierEmoji(entry.tier) : ''}
              </span>
              <span class="rank-score">{entry.score.toLocaleString()}점</span>
            </li>
          {/each}
        </ol>
      {/if}
    </div>
  {/if}
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
    margin-bottom: 32px;
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

  /* 탭 */
  .tabs {
    display: flex;
    gap: 8px;
    justify-content: center;
    margin-bottom: 28px;
  }

  .tab {
    background: rgba(255, 255, 255, 0.6);
    border: 2px solid rgba(255, 107, 157, 0.2);
    border-radius: 24px;
    padding: 8px 24px;
    font-size: 15px;
    font-weight: 700;
    color: #8b5a8e;
    cursor: pointer;
    transition: all 0.2s;
  }

  .tab.active {
    background: #ff6b9d;
    border-color: #ff6b9d;
    color: white;
    box-shadow: 0 4px 16px rgba(255, 107, 157, 0.35);
  }

  .tab:not(.active):hover {
    background: rgba(255, 107, 157, 0.1);
    border-color: rgba(255, 107, 157, 0.4);
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

  .game-card:not(.unavailable):hover {
    transform: translateY(-12px) scale(1.05);
    box-shadow:
      0 16px 48px rgba(0, 0, 0, 0.15),
      0 0 0 6px rgba(255, 255, 255, 0.5);
  }

  .game-card:not(.unavailable):active {
    transform: translateY(-8px) scale(1.02);
  }

  .game-card.unavailable {
    opacity: 0.6;
    cursor: not-allowed;
    filter: grayscale(30%);
  }

  .coming-soon-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(0, 0, 0, 0.35);
    color: white;
    font-size: 11px;
    font-weight: 700;
    padding: 3px 9px;
    border-radius: 20px;
  }

  .game-emoji {
    font-size: clamp(56px, 12vw, 80px);
    margin-bottom: 12px;
    animation: wiggle 1.5s ease-in-out infinite;
  }

  .game-card:not(.unavailable):hover .game-emoji {
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

  .play-icon.soon {
    font-size: 20px;
    background: rgba(0, 0, 0, 0.15);
  }

  .game-card:not(.unavailable):hover .play-icon {
    background: rgba(255, 255, 255, 0.5);
    transform: scale(1.2);
  }

  /* 랭킹 패널 */
  .rankings-panel {
    background: rgba(255, 255, 255, 0.75);
    border-radius: 24px;
    padding: 24px 20px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
    animation: fadeInUp 0.4s ease;
  }

  .ranking-game-label {
    font-size: 17px;
    font-weight: 800;
    color: #ff6b9d;
    margin-bottom: 16px;
  }

  .rank-loading {
    color: #8b5a8e;
    padding: 32px;
    font-size: 15px;
  }

  .rank-empty {
    padding: 32px 16px;
    color: #8b5a8e;
  }

  .rank-empty-icon {
    font-size: 48px;
    margin-bottom: 12px;
  }

  .rank-empty-sub {
    font-size: 13px;
    color: #aaa;
    margin-top: 4px;
  }

  .rank-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .rank-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 16px;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.6);
  }

  .rank-item.top3 {
    background: linear-gradient(135deg, rgba(255, 107, 157, 0.12), rgba(255, 183, 77, 0.12));
  }

  .rank-num {
    font-size: 20px;
    min-width: 36px;
    text-align: center;
    font-weight: 900;
    color: #555;
  }

  .rank-name {
    flex: 1;
    font-size: 15px;
    font-weight: 700;
    color: #2d1b4e;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .rank-score {
    font-size: 15px;
    font-weight: 800;
    color: #ff6b9d;
    white-space: nowrap;
  }

  /* 애니메이션 */
  @keyframes fadeInDown {
    from { opacity: 0; transform: translateY(-30px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-10px); }
  }

  @keyframes wiggle {
    0%, 100% { transform: rotate(0deg); }
    25%       { transform: rotate(-5deg); }
    75%       { transform: rotate(5deg); }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  /* 반응형 */
  @media (max-width: 480px) {
    .lobby { padding: 24px 16px; }
    .games { grid-template-columns: 1fr; }
  }
</style>
