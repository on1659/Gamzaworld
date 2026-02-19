<script>
  import { user } from '../stores.js';

  let currentUser;
  user.subscribe(value => currentUser = value);

  function handleLogin() {
    const apiUrl = import.meta.env.PROD 
      ? window.location.origin 
      : 'http://localhost:3000';
    
    window.location.href = `${apiUrl}/auth/google`;
  }

  function handleLogout() {
    user.logout();
  }
</script>

{#if currentUser}
  <!-- 로그인 상태 -->
  <div class="user-info">
    <img 
      src={currentUser.avatar_url} 
      alt={currentUser.username}
      class="user-avatar"
    />
    <span class="user-name">{currentUser.username}</span>
    <span class="user-level">Lv. {currentUser.level}</span>
    <button class="logout-btn" on:click={handleLogout}>
      로그아웃
    </button>
  </div>
{:else}
  <!-- 로그아웃 상태 -->
  <button class="login-btn" on:click={handleLogin}>
    <span class="login-icon">🔐</span>
    <span>구글로 로그인</span>
  </button>
{/if}

<style>
  /* 로그인 버튼 */
  .login-btn {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-md);
    background: var(--color-bg-secondary);
    color: var(--color-text-primary);
    border: var(--border-width-medium) solid var(--color-border-primary);
    border-radius: var(--border-radius-md);
    font-family: var(--font-display);
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-bold);
    cursor: pointer;
    transition: all var(--duration-normal) cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .login-btn:hover {
    background: var(--color-primary);
    color: var(--color-text-white);
    transform: translateY(-2px);
    box-shadow: var(--shadow-colored);
  }

  .login-btn:active {
    animation: elasticBounce var(--duration-normal);
  }

  .login-icon {
    font-size: var(--font-size-lg);
  }

  /* 유저 정보 */
  .user-info {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-xs) var(--spacing-md);
    background: var(--color-bg-secondary);
    border: var(--border-width-medium) solid var(--color-border-primary);
    border-radius: var(--border-radius-full);
  }

  .user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: var(--border-width-thin) solid var(--color-border-primary);
  }

  .user-name {
    font-family: var(--font-display);
    font-size: var(--font-size-base);
    color: var(--color-text-primary);
    font-weight: var(--font-weight-bold);
  }

  .user-level {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    padding: 2px 8px;
    background: var(--color-primary-light);
    border-radius: var(--border-radius-full);
  }

  .logout-btn {
    padding: var(--spacing-xs) var(--spacing-sm);
    background: transparent;
    color: var(--color-text-secondary);
    border: none;
    border-radius: var(--border-radius-sm);
    font-size: var(--font-size-sm);
    cursor: pointer;
    transition: all var(--duration-fast);
  }

  .logout-btn:hover {
    background: var(--color-bg-tertiary);
    color: var(--color-text-primary);
  }

  @media (max-width: 768px) {
    .user-name {
      display: none;
    }
  }
</style>
