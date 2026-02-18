<script>
  // Mock 데이터 (추후 DB 연동)
  const profile = {
    username: '감자왕',
    level: 42,
    tier: '다이아',
    icon: '💎',
    totalScore: 123456,
    gamesPlayed: 567,
    joinDate: '2026-02-01'
  };

  const achievements = [
    { id: 1, name: '100점 돌파', icon: '🎯', unlocked: true, date: '2026-02-10' },
    { id: 2, name: '연속 10일 플레이', icon: '🔥', unlocked: true, date: '2026-02-12' },
    { id: 3, name: '전체 1위', icon: '👑', unlocked: false },
    { id: 4, name: '다이아 티어 달성', icon: '💎', unlocked: true, date: '2026-02-15' },
    { id: 5, name: '퍼펙트 게임', icon: '⭐', unlocked: false },
    { id: 6, name: '전설의 시작', icon: '🏆', unlocked: false }
  ];

  const gameStats = [
    { game: '타이밍 점프', bestScore: 9999, plays: 200 },
    { game: '리듬 탭', bestScore: 8888, plays: 150 },
    { game: '스택 타워', bestScore: 7777, plays: 217 }
  ];
</script>

<div class="profile">
  <h2>👤 프로필</h2>
  
  <div class="profile-card">
    <div class="profile-header">
      <div class="profile-icon">{profile.icon}</div>
      <div class="profile-info">
        <h3>{profile.username}</h3>
        <div class="profile-tier">
          <span class="tier-badge">{profile.tier}</span>
          <span class="level">Lv. {profile.level}</span>
        </div>
        <div class="profile-stats">
          <span>총 점수: {profile.totalScore.toLocaleString()}</span>
          <span>플레이 횟수: {profile.gamesPlayed}</span>
          <span>가입일: {profile.joinDate}</span>
        </div>
      </div>
    </div>
  </div>

  <div class="section">
    <h3>🎖 업적</h3>
    <div class="achievements-grid">
      {#each achievements as achievement}
        <div class="achievement" class:unlocked={achievement.unlocked}>
          <div class="achievement-icon">{achievement.icon}</div>
          <div class="achievement-name">{achievement.name}</div>
          {#if achievement.unlocked}
            <div class="achievement-date">{achievement.date}</div>
          {:else}
            <div class="achievement-locked">🔒</div>
          {/if}
        </div>
      {/each}
    </div>
  </div>

  <div class="section">
    <h3>📊 게임 통계</h3>
    <div class="stats-table">
      {#each gameStats as stat}
        <div class="stat-row">
          <div class="stat-game">{stat.game}</div>
          <div class="stat-details">
            <span>최고 점수: <strong>{stat.bestScore.toLocaleString()}</strong></span>
            <span>플레이 횟수: <strong>{stat.plays}</strong></span>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .profile {
    max-width: 800px;
    margin: 0 auto;
  }

  h2 {
    font-size: 32px;
    margin-bottom: 24px;
    text-align: center;
    background: linear-gradient(135deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .profile-card {
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 16px;
    padding: 32px;
    margin-bottom: 32px;
    color: white;
    box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
  }

  .profile-header {
    display: flex;
    gap: 24px;
    align-items: center;
  }

  .profile-icon {
    font-size: 80px;
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
  }

  .profile-info {
    flex: 1;
  }

  .profile-info h3 {
    font-size: 32px;
    margin-bottom: 12px;
  }

  .profile-tier {
    display: flex;
    gap: 12px;
    align-items: center;
    margin-bottom: 12px;
  }

  .tier-badge {
    padding: 6px 16px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 20px;
    font-weight: bold;
  }

  .level {
    font-size: 18px;
    font-weight: bold;
  }

  .profile-stats {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 14px;
    opacity: 0.9;
  }

  .section {
    margin-bottom: 32px;
  }

  .section h3 {
    font-size: 24px;
    margin-bottom: 16px;
    color: #333;
  }

  .achievements-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 16px;
  }

  .achievement {
    background: white;
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    padding: 16px;
    text-align: center;
    transition: all 0.3s;
    opacity: 0.5;
  }

  .achievement.unlocked {
    opacity: 1;
    border-color: #667eea;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  }

  .achievement-icon {
    font-size: 48px;
    margin-bottom: 8px;
  }

  .achievement-name {
    font-size: 14px;
    font-weight: bold;
    color: #333;
    margin-bottom: 4px;
  }

  .achievement-date {
    font-size: 11px;
    color: #666;
  }

  .achievement-locked {
    font-size: 20px;
  }

  .stats-table {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  .stat-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid #f0f0f0;
  }

  .stat-row:last-child {
    border-bottom: none;
  }

  .stat-game {
    font-size: 16px;
    font-weight: bold;
    color: #667eea;
  }

  .stat-details {
    display: flex;
    gap: 24px;
    font-size: 14px;
    color: #666;
  }

  .stat-details strong {
    color: #333;
  }

  @media (max-width: 768px) {
    .profile-card {
      padding: 24px;
    }

    .profile-header {
      flex-direction: column;
      text-align: center;
    }

    .profile-info h3 {
      font-size: 24px;
    }

    .achievements-grid {
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    }

    .stat-row {
      flex-direction: column;
      gap: 8px;
      align-items: flex-start;
    }

    .stat-details {
      flex-direction: column;
      gap: 4px;
    }
  }
</style>
