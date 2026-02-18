<script>
  import { writable } from 'svelte/store';
  import Lobby from './components/Lobby.svelte';
  import Ranking from './components/Ranking.svelte';
  import Chat from './components/Chat.svelte';
  import Profile from './components/Profile.svelte';

  // 간단한 라우터 (페이지 상태)
  export const currentPage = writable('lobby');
  export const currentGame = writable(null);
  export const user = writable(null);

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
      <Lobby />
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
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
  }

  .app {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  .navbar {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 16px;
    padding: 16px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    margin-bottom: 24px;
  }

  .logo {
    margin: 0;
    font-size: 24px;
    font-weight: bold;
    background: linear-gradient(135deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .nav-right {
    display: flex;
    gap: 12px;
  }

  .nav-right button {
    padding: 10px 20px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 600;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .nav-right button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }

  .content {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 16px;
    padding: 32px;
    min-height: 500px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    .app {
      padding: 12px;
    }

    .navbar {
      flex-direction: column;
      gap: 16px;
    }

    .nav-right {
      width: 100%;
      justify-content: center;
      flex-wrap: wrap;
    }

    .content {
      padding: 20px;
    }
  }
</style>
