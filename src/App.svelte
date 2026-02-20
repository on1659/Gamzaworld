<script>
  import Lobby from './Lobby.svelte';
</script>

<main>
  <Lobby />
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
