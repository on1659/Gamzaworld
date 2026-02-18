<script>
  let selectedGame = 'timing-jump';
  
  const games = [
    { id: 'timing-jump', name: '타이밍 점프' },
    { id: 'rhythm-tap', name: '리듬 탭' },
    { id: 'stack-tower', name: '스택 타워' }
  ];

  // Mock 데이터 (추후 API 연동)
  const rankings = {
    'timing-jump': [
      { rank: 1, name: '감자왕', score: 9999, tier: '다이아', icon: '💎' },
      { rank: 2, name: '타이밍고수', score: 8888, tier: '플래티넘', icon: '🏆' },
      { rank: 3, name: '점프마스터', score: 7777, tier: '골드', icon: '🥇' },
      { rank: 4, name: '캐주얼플레이어', score: 6666, tier: '실버', icon: '🥈' },
      { rank: 5, name: '초보자', score: 5555, tier: '브론즈', icon: '🥉' }
    ],
    'rhythm-tap': [],
    'stack-tower': []
  };

  $: currentRankings = rankings[selectedGame] || [];
</script>

<div class="ranking">
  <h2>🏆 랭킹</h2>
  <p class="subtitle">최고의 플레이어들과 경쟁하세요!</p>

  <div class="game-selector">
    {#each games as game}
      <button 
        class:active={selectedGame === game.id}
        on:click={() => selectedGame = game.id}
      >
        {game.name}
      </button>
    {/each}
  </div>

  <div class="ranking-table">
    {#if currentRankings.length > 0}
      {#each currentRankings as player}
        <div class="rank-row" class:top3={player.rank <= 3}>
          <div class="rank-number">#{player.rank}</div>
          <div class="player-icon">{player.icon}</div>
          <div class="player-info">
            <div class="player-name">{player.name}</div>
            <div class="player-tier">{player.tier}</div>
          </div>
          <div class="player-score">{player.score.toLocaleString()}점</div>
        </div>
      {/each}
    {:else}
      <div class="empty-state">
        <p>아직 플레이 기록이 없습니다</p>
        <p>첫 번째 기록을 만들어보세요! 🚀</p>
      </div>
    {/if}
  </div>
</div>

<style>
  .ranking {
    text-align: center;
  }

  h2 {
    font-size: 32px;
    margin-bottom: 8px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .subtitle {
    color: #666;
    margin-bottom: 32px;
  }

  .game-selector {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-bottom: 32px;
    flex-wrap: wrap;
  }

  .game-selector button {
    padding: 12px 24px;
    background: white;
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s;
  }

  .game-selector button.active {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border-color: transparent;
  }

  .ranking-table {
    max-width: 600px;
    margin: 0 auto;
  }

  .rank-row {
    display: flex;
    align-items: center;
    gap: 16px;
    background: white;
    padding: 16px;
    border-radius: 12px;
    margin-bottom: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s;
  }

  .rank-row:hover {
    transform: translateX(8px);
  }

  .rank-row.top3 {
    background: linear-gradient(135deg, #fff9e6, #fff);
    border: 2px solid #ffd700;
  }

  .rank-number {
    font-size: 24px;
    font-weight: bold;
    color: #667eea;
    min-width: 40px;
  }

  .player-icon {
    font-size: 32px;
  }

  .player-info {
    flex: 1;
    text-align: left;
  }

  .player-name {
    font-size: 18px;
    font-weight: bold;
    color: #333;
  }

  .player-tier {
    font-size: 12px;
    color: #666;
  }

  .player-score {
    font-size: 20px;
    font-weight: bold;
    background: linear-gradient(135deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .empty-state {
    padding: 60px 20px;
    color: #999;
  }

  .empty-state p {
    margin: 8px 0;
  }

  @media (max-width: 768px) {
    .rank-row {
      gap: 12px;
      padding: 12px;
    }

    .rank-number {
      font-size: 18px;
      min-width: 30px;
    }

    .player-icon {
      font-size: 24px;
    }

    .player-name {
      font-size: 16px;
    }

    .player-score {
      font-size: 16px;
    }
  }
</style>
