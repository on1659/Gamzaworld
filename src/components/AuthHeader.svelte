<script>
  export let user = null;   // { id, username, avatar_url, tier }
  export let onLogin = () => {};
  export let onLogout = () => {};

  let menuOpen = false;

  function tierEmoji(tier) {
    const map = { bronze: '🥉', silver: '🥈', gold: '🥇', diamond: '💎' };
    return map[tier] || '🎮';
  }

  function toggleMenu() {
    menuOpen = !menuOpen;
  }

  function handleLogout() {
    menuOpen = false;
    onLogout();
  }
</script>

<header class="auth-header">
  <div class="header-inner">
    <div class="logo">🎮 감자월드</div>

    <div class="auth-area">
      {#if user}
        <button class="profile-btn" on:click={toggleMenu} aria-label="프로필 메뉴">
          {#if user.avatar_url}
            <img class="avatar" src={user.avatar_url} alt={user.username} referrerpolicy="no-referrer" />
          {:else}
            <div class="avatar-placeholder">{user.username?.[0] ?? '?'}</div>
          {/if}
          <span class="username">{user.username}</span>
          <span class="tier-badge">{tierEmoji(user.tier)}</span>
        </button>

        {#if menuOpen}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <div class="dropdown-backdrop" on:click={() => menuOpen = false}></div>
          <div class="dropdown">
            <div class="dropdown-info">
              <strong>{user.username}</strong>
              <span class="dropdown-tier">{tierEmoji(user.tier)} {user.tier ?? 'bronze'}</span>
            </div>
            <hr class="dropdown-divider" />
            <button class="dropdown-item logout" on:click={handleLogout}>
              🚪 로그아웃
            </button>
          </div>
        {/if}
      {:else}
        <button class="login-btn" on:click={onLogin}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.45 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google로 로그인
        </button>
      {/if}
    </div>
  </div>
</header>

<style>
  .auth-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255, 107, 157, 0.15);
  }

  .header-inner {
    max-width: 800px;
    margin: 0 auto;
    padding: 10px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .logo {
    font-size: 18px;
    font-weight: 900;
    color: #ff6b9d;
  }

  .login-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background: white;
    border: 2px solid #e0e0e0;
    border-radius: 24px;
    padding: 7px 16px;
    font-size: 13px;
    font-weight: 700;
    color: #444;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }

  .login-btn:hover {
    border-color: #4285F4;
    box-shadow: 0 4px 16px rgba(66, 133, 244, 0.2);
    transform: translateY(-1px);
  }

  .profile-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 107, 157, 0.1);
    border: 2px solid rgba(255, 107, 157, 0.25);
    border-radius: 24px;
    padding: 5px 12px 5px 5px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .profile-btn:hover {
    background: rgba(255, 107, 157, 0.18);
    border-color: #ff6b9d;
  }

  .avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
  }

  .avatar-placeholder {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #ff6b9d;
    color: white;
    font-size: 14px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .username {
    font-size: 13px;
    font-weight: 700;
    color: #2d1b4e;
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .tier-badge {
    font-size: 16px;
  }

  .auth-area {
    position: relative;
  }

  .dropdown-backdrop {
    position: fixed;
    inset: 0;
    z-index: 10;
  }

  .dropdown {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    min-width: 180px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.15);
    border: 1px solid rgba(0,0,0,0.06);
    overflow: hidden;
    z-index: 20;
    animation: dropDown 0.15s ease;
  }

  .dropdown-info {
    padding: 14px 16px 10px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .dropdown-info strong {
    font-size: 14px;
    color: #2d1b4e;
  }

  .dropdown-tier {
    font-size: 12px;
    color: #8b5a8e;
    text-transform: capitalize;
  }

  .dropdown-divider {
    border: none;
    border-top: 1px solid #f0f0f0;
    margin: 0;
  }

  .dropdown-item {
    width: 100%;
    background: none;
    border: none;
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 600;
    text-align: left;
    cursor: pointer;
    transition: background 0.15s;
  }

  .dropdown-item.logout {
    color: #e53935;
  }

  .dropdown-item:hover {
    background: #fafafa;
  }

  @keyframes dropDown {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
</style>
