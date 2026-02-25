<script>
  import Lobby from './Lobby.svelte';
  import TimingJump from './games/timing-jump/TimingJump.svelte';

  let currentView = 'lobby'; // 'lobby' | 'timing-jump'

  function goToGame(gameId) {
    currentView = gameId;
  }

  function goToLobby() {
    currentView = 'lobby';
  }
</script>

<main>
  {#if currentView === 'lobby'}
    <Lobby onPlay={goToGame} />
  {:else if currentView === 'timing-jump'}
    <TimingJump onBack={goToLobby} />
  {/if}
</main>

<style>
  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(body) {
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
    background: linear-gradient(135deg, #ffeef8 0%, #e0f4ff 50%, #fff4e0 100%);
    min-height: 100vh;
    overflow-x: hidden;
  }

  main {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
