<script>
  import { LobbyStyle1, LobbyStyle2, LobbyStyle3, LobbyStyle4, LobbyStyle5, lobbyStyles } from './lobby-styles/index.js';
  import { currentPage, currentGame } from '../stores.js';
  
  const components = [LobbyStyle1, LobbyStyle2, LobbyStyle3, LobbyStyle4, LobbyStyle5];
  
  let currentStyleIndex = 0;
  
  const games = [
    {
      id: 'timing-jump',
      name: '타이밍 점프',
      description: '장애물을 피하며 최대한 멀리!',
      emoji: '🏃',
      difficulty: 'easy'
    },
    {
      id: 'rhythm-tap',
      name: '리듬 탭',
      description: '떨어지는 노트를 정확히 터치!',
      emoji: '🎵',
      difficulty: 'normal'
    },
    {
      id: 'stack-tower',
      name: '스택 타워',
      description: '타이밍 맞춰 블록 쌓기!',
      emoji: '🏗️',
      difficulty: 'hard'
    }
  ];
  
  function prevStyle() {
    currentStyleIndex = currentStyleIndex > 0 ? currentStyleIndex - 1 : components.length - 1;
  }
  
  function nextStyle() {
    currentStyleIndex = currentStyleIndex < components.length - 1 ? currentStyleIndex + 1 : 0;
  }
  
  async function startGame(gameId) {
    try {
      if (gameId === 'timing-jump') {
        const module = await import('../games/timing-jump/TimingJump.svelte');
        currentGame.set(module.default);
        currentPage.set('game');
      } else {
        alert(`${gameId} 준비 중이에요! 🚧`);
      }
    } catch (error) {
      console.error('Failed to load game:', error);
      alert('게임을 불러올 수 없어요 😢');
    }
  }
  
  function handleKeydown(event) {
    if (event.key === 'ArrowLeft') {
      prevStyle();
    } else if (event.key === 'ArrowRight') {
      nextStyle();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="lobby-showcase">
  <div class="showcase-header">
    <h1 class="showcase-title">🎨 로비 디자인 스타일 쇼케이스</h1>
    <p class="showcase-desc">
      {lobbyStyles[currentStyleIndex].name} - {lobbyStyles[currentStyleIndex].description}
    </p>
  </div>
  
  <div class="style-container">
    <svelte:component this={components[currentStyleIndex]} {games} onStartGame={startGame} />
  </div>
  
  <div class="navigation">
    <button class="nav-btn" on:click={prevStyle}>
      ← 이전
    </button>
    
    <div class="style-indicator">
      <span class="current-num">{currentStyleIndex + 1}</span>
      <span class="divider">/</span>
      <span class="total-num">{components.length}</span>
    </div>
    
    <button class="nav-btn" on:click={nextStyle}>
      다음 →
    </button>
  </div>
  
  <div class="style-dots">
    {#each components as _, i}
      <button 
        class="dot" 
        class:active={i === currentStyleIndex}
        on:click={() => currentStyleIndex = i}
      ></button>
    {/each}
  </div>
  
  <div class="keyboard-hint">
    💡 Tip: 키보드 ← → 화살표로도 전환 가능!
  </div>
</div>

<style>
  .lobby-showcase {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .showcase-header {
    background: var(--color-bg-secondary);
    border-bottom: var(--border-width-medium) solid var(--color-border-primary);
    padding: var(--spacing-lg);
    text-align: center;
  }

  .showcase-title {
    font-family: var(--font-display);
    font-size: var(--font-size-2xl);
    color: var(--color-primary);
    margin-bottom: var(--spacing-sm);
  }

  .showcase-desc {
    font-size: var(--font-size-lg);
    color: var(--color-text-secondary);
  }

  .style-container {
    flex: 1;
    overflow-y: auto;
  }

  .navigation {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--spacing-xl);
    padding: var(--spacing-lg);
    background: var(--color-bg-secondary);
    border-top: var(--border-width-medium) solid var(--color-border-primary);
  }

  .nav-btn {
    padding: var(--spacing-md) var(--spacing-xl);
    background: var(--color-primary);
    color: white;
    border: var(--border-width-medium) solid var(--color-border-primary);
    border-radius: var(--border-radius-md);
    font-family: var(--font-display);
    font-size: var(--font-size-lg);
    cursor: pointer;
    transition: all var(--duration-normal);
  }

  .nav-btn:hover {
    background: var(--color-primary-dark);
    transform: scale(1.05);
  }

  .style-indicator {
    font-family: var(--font-display);
    font-size: var(--font-size-2xl);
    display: flex;
    align-items: baseline;
    gap: var(--spacing-xs);
  }

  .current-num {
    font-size: var(--font-size-3xl);
    color: var(--color-primary);
    font-weight: var(--font-weight-bold);
  }

  .divider {
    color: var(--color-text-secondary);
  }

  .total-num {
    color: var(--color-text-secondary);
  }

  .style-dots {
    display: flex;
    justify-content: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-md);
    background: var(--color-bg-secondary);
  }

  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--color-border-light);
    border: none;
    cursor: pointer;
    transition: all var(--duration-fast);
  }

  .dot.active {
    background: var(--color-primary);
    transform: scale(1.5);
  }

  .keyboard-hint {
    text-align: center;
    padding: var(--spacing-sm);
    background: var(--color-accent-1);
    color: white;
    font-size: var(--font-size-sm);
  }

  @media (max-width: 768px) {
    .showcase-title {
      font-size: var(--font-size-xl);
    }

    .navigation {
      gap: var(--spacing-md);
    }

    .nav-btn {
      padding: var(--spacing-sm) var(--spacing-md);
      font-size: var(--font-size-base);
    }

    .style-indicator {
      font-size: var(--font-size-xl);
    }

    .current-num {
      font-size: var(--font-size-2xl);
    }
  }
</style>
