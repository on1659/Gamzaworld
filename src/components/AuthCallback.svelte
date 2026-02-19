<script>
  import { onMount } from 'svelte';
  import { user, currentPage } from '../stores.js';

  let status = 'loading';
  let message = '로그인 중...';

  onMount(async () => {
    // URL에서 토큰 추출
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) {
      status = 'error';
      message = '로그인 실패: 토큰이 없습니다';
      setTimeout(() => currentPage.set('lobby'), 2000);
      return;
    }

    try {
      // 토큰으로 유저 정보 가져오기
      const apiUrl = import.meta.env.PROD 
        ? window.location.origin 
        : 'http://localhost:3000';

      const response = await fetch(`${apiUrl}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }

      const userData = await response.json();
      
      // Store에 저장
      user.login(userData, token);

      status = 'success';
      message = `환영합니다, ${userData.username}님! 🎉`;

      // 2초 후 로비로 이동
      setTimeout(() => {
        currentPage.set('lobby');
        // URL에서 토큰 제거
        window.history.replaceState({}, '', '/');
      }, 2000);

    } catch (error) {
      console.error('Auth callback error:', error);
      status = 'error';
      message = '로그인 실패: 다시 시도해주세요';
      setTimeout(() => currentPage.set('lobby'), 2000);
    }
  });
</script>

<div class="auth-callback">
  <div class="callback-card">
    {#if status === 'loading'}
      <div class="spinner"></div>
      <p class="message">{message}</p>
    {:else if status === 'success'}
      <div class="icon success">✅</div>
      <p class="message success">{message}</p>
    {:else}
      <div class="icon error">❌</div>
      <p class="message error">{message}</p>
    {/if}
  </div>
</div>

<style>
  .auth-callback {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 500px;
  }

  .callback-card {
    background: var(--color-bg-secondary);
    border: var(--border-width-thick) solid var(--color-border-primary);
    border-radius: var(--border-radius-xl);
    padding: var(--spacing-2xl);
    box-shadow: var(--shadow-lg);
    text-align: center;
    animation: popIn var(--duration-normal);
  }

  .spinner {
    width: 60px;
    height: 60px;
    margin: 0 auto var(--spacing-lg);
    border: var(--border-width-thick) solid var(--color-border-light);
    border-top-color: var(--color-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .icon {
    font-size: var(--font-size-3xl);
    margin-bottom: var(--spacing-md);
  }

  .message {
    font-family: var(--font-display);
    font-size: var(--font-size-xl);
    color: var(--color-text-primary);
  }

  .message.success {
    color: var(--color-accent-1);
  }

  .message.error {
    color: var(--color-primary);
  }
</style>
