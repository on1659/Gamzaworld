<script>
  import { currentPage, currentGame, user } from './stores.js';
  import LobbyNew from './components/LobbyNew.svelte';
  import Ranking from './components/Ranking.svelte';
  import Chat from './components/Chat.svelte';
  import Profile from './components/Profile.svelte';
  
  // 테마 CSS 임포트
  import './styles/theme.css';

  let page;
  let gameComponent;
  
  currentPage.subscribe(value => page = value);
  currentGame.subscribe(value => gameComponent = value);
</script>

<main class="app">
  <!-- 상단 네비게이션 -->
  <nav class="navbar">
    <div class="nav-left">
      <h1 class="logo">🎮 Gamzaworld</h1>
    </div>
    <div class="nav-right">
      <button on:click={() => currentPage.set('lobby')}>로비</button>
      <button on:click={() => currentPage.set('ranking')}>랭킹</button>
      <button on:click={() => currentPage.set('chat')}>채팅</button>
      <button on:click={() => currentPage.set('profile')}>프로필</button>
    </div>
  </nav>

  <!-- 페이지 컨텐츠 -->
  <div class="content">
    {#if page === 'lobby'}
      <LobbyNew />
    {:else if page === 'ranking'}
      <Ranking />
    {:else if page === 'chat'}
      <Chat />
    {:else if page === 'profile'}
      <Profile />
    {:else if page === 'game' && gameComponent}
      <svelte:component this={gameComponent} />
    {/if}
  </div>
</main>

<style>
  /* App 컨테이너 */
  .app {
    max-width: 1400px;
    margin: 0 auto;
    padding: var(--spacing-lg);
    min-height: 100vh;
  }

  /* 네비게이션 바 */
  .navbar {
    background: var(--color-bg-secondary);
    border: var(--border-width-thick) solid var(--color-border-primary);
    border-radius: var(--border-radius-xl);
    padding: var(--spacing-md) var(--spacing-xl);
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: var(--shadow-lg);
    margin-bottom: var(--spacing-xl);
    position: relative;
    overflow: hidden;
  }

  /* 네비바 장식 요소 */
  .navbar::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 6px;
    background: linear-gradient(90deg, 
      var(--color-primary) 0%, 
      var(--color-secondary) 50%, 
      var(--color-accent-2) 100%
    );
  }

  .logo {
    margin: 0;
    font-family: var(--font-display);
    font-size: var(--font-size-2xl);
    color: var(--color-primary);
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    text-shadow: 2px 2px 0 var(--color-border-primary);
  }

  .nav-right {
    display: flex;
    gap: var(--spacing-sm);
  }

  .nav-right button {
    padding: var(--spacing-sm) var(--spacing-md);
    background: var(--color-bg-primary);
    color: var(--color-text-primary);
    border: var(--border-width-medium) solid var(--color-border-primary);
    border-radius: var(--border-radius-md);
    font-family: var(--font-display);
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-bold);
    cursor: pointer;
    transition: all var(--duration-normal) cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
  }

  .nav-right button:hover {
    background: var(--color-primary);
    color: var(--color-text-white);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  .nav-right button:active {
    animation: elasticBounce var(--duration-normal);
  }

  /* 활성 탭 표시 (추후 추가 가능) */
  .nav-right button.active {
    background: var(--color-secondary);
    box-shadow: var(--shadow-colored);
  }

  /* 컨텐츠 영역 */
  .content {
    background: transparent;
    min-height: 500px;
  }

  /* 반응형 */
  @media (max-width: 768px) {
    .app {
      padding: var(--spacing-md);
    }

    .navbar {
      flex-direction: column;
      gap: var(--spacing-md);
      padding: var(--spacing-md);
    }

    .logo {
      font-size: var(--font-size-xl);
    }

    .nav-right {
      width: 100%;
      justify-content: center;
      flex-wrap: wrap;
    }

    .nav-right button {
      flex: 1;
      min-width: 120px;
    }
  }
</style>
