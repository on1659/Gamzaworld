<script>
  import { currentPage, currentGame } from '../App.svelte';

  const games = [
    {
      id: 'timing-jump',
      name: '타이밍 점프',
      description: '장애물을 피하며 최대한 멀리 가세요!',
      icon: '🏃',
      difficulty: '쉬움'
    },
    {
      id: 'rhythm-tap',
      name: '리듬 탭',
      description: '떨어지는 노트를 정확히 터치!',
      icon: '🎵',
      difficulty: '보통'
    },
    {
      id: 'stack-tower',
      name: '스택 타워',
      description: '타이밍 맞춰 블록을 쌓아올려요',
      icon: '🏗️',
      difficulty: '어려움'
    }
  ];

  async function startGame(gameId) {
    try {
      let GameComponent;
      
      // 동적 import로 게임 컴포넌트 로드
      if (gameId === 'timing-jump') {
        const module = await import('../games/timing-jump/TimingJump.svelte');
        GameComponent = module.default;
      } else {
        alert(`${gameId} 게임 준비 중... (개발 예정)`);
        return;
      }
      
      // 게임 페이지로 전환
      currentGame.set(GameComponent);
      currentPage.set('game');
    } catch (error) {
      console.error('Failed to load game:', error);
      alert('게임 로드 실패!');
    }
  }
</script>

<div class="lobby">
  <h2>🎮 게임 선택</h2>
  <p class="subtitle">플레이할 게임을 선택하세요!</p>

  <div class="game-grid">
    {#each games as game}
      <div class="game-card">
        <div class="game-icon">{game.icon}</div>
        <h3>{game.name}</h3>
        <p class="description">{game.description}</p>
        <div class="difficulty {game.difficulty}">
          난이도: {game.difficulty}
        </div>
        <button on:click={() => startGame(game.id)}>
          플레이 하기
        </button>
      </div>
    {/each}
  </div>

  <div class="stats-banner">
    <div class="stat">
      <span class="stat-value">1,234</span>
      <span class="stat-label">온라인 플레이어</span>
    </div>
    <div class="stat">
      <span class="stat-value">45,678</span>
      <span class="stat-label">전체 플레이 횟수</span>
    </div>
    <div class="stat">
      <span class="stat-value">3</span>
      <span class="stat-label">게임 종류</span>
    </div>
  </div>
</div>

<style>
  .lobby {
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

  .game-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
    margin-bottom: 40px;
  }

  .game-card {
    background: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    transition: transform 0.3s, box-shadow 0.3s;
    border: 2px solid transparent;
  }

  .game-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 32px rgba(102, 126, 234, 0.3);
    border-color: #667eea;
  }

  .game-icon {
    font-size: 64px;
    margin-bottom: 16px;
  }

  h3 {
    font-size: 24px;
    margin-bottom: 12px;
    color: #333;
  }

  .description {
    color: #666;
    font-size: 14px;
    margin-bottom: 16px;
    min-height: 40px;
  }

  .difficulty {
    display: inline-block;
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 16px;
  }

  .difficulty.쉬움 {
    background: #d4edda;
    color: #155724;
  }

  .difficulty.보통 {
    background: #fff3cd;
    color: #856404;
  }

  .difficulty.어려움 {
    background: #f8d7da;
    color: #721c24;
  }

  button {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  button:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }

  .stats-banner {
    display: flex;
    justify-content: space-around;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 16px;
    padding: 24px;
    color: white;
  }

  .stat {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .stat-value {
    font-size: 32px;
    font-weight: bold;
  }

  .stat-label {
    font-size: 14px;
    opacity: 0.9;
  }

  @media (max-width: 768px) {
    .game-grid {
      grid-template-columns: 1fr;
    }

    .stats-banner {
      flex-direction: column;
      gap: 16px;
    }
  }
</style>
