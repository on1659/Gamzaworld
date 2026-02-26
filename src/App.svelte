<script>
  import { onMount } from 'svelte';
  import Lobby from './Lobby.svelte';
  import TimingJump from './games/timing-jump/TimingJump.svelte';
  import RhythmTap from './games/rhythm-tap/RhythmTap.svelte';
  import StackTower from './games/stack-tower/StackTower.svelte';
  import AuthHeader from './components/AuthHeader.svelte';

  let currentView = 'lobby'; // 'lobby' | 'timing-jump' | 'rhythm-tap' | 'stack-tower'
  let user = null; // 로그인한 유저 정보

  // ── 인증 ───────────────────────────────────────────
  function getToken() {
    return localStorage.getItem('gw_token');
  }

  function setToken(token) {
    localStorage.setItem('gw_token', token);
  }

  function clearToken() {
    localStorage.removeItem('gw_token');
  }

  async function fetchMe(token) {
    try {
      const res = await fetch('/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  function handleLogin() {
    // Google OAuth 시작
    window.location.href = '/auth/google';
  }

  function handleLogout() {
    clearToken();
    user = null;
  }

  // ── Auth callback (/auth/callback?token=...) ──────
  onMount(async () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      setToken(token);
      // URL 정리
      window.history.replaceState({}, '', window.location.pathname);
    }

    const stored = getToken();
    if (stored) {
      user = await fetchMe(stored);
      if (!user) clearToken(); // 만료된 토큰 정리
    }
  });

  // ── 뷰 전환 ──────────────────────────────────────
  function goToGame(gameId) {
    currentView = gameId;
  }

  function goToLobby() {
    currentView = 'lobby';
  }
</script>

<AuthHeader {user} onLogin={handleLogin} onLogout={handleLogout} />

<main>
  {#if currentView === 'lobby'}
    <Lobby onPlay={goToGame} />
  {:else if currentView === 'timing-jump'}
    <TimingJump onBack={goToLobby} />
  {:else if currentView === 'rhythm-tap'}
    <RhythmTap onBack={goToLobby} />
  {:else if currentView === 'stack-tower'}
    <StackTower onBack={goToLobby} />
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
    padding-top: 56px; /* AuthHeader 높이 */
  }
</style>
