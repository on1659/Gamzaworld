/**
 * 전역 상태 관리 (Svelte stores)
 */

import { writable } from 'svelte/store';

// 현재 페이지
export const currentPage = writable('lobby');

// 현재 게임 컴포넌트
export const currentGame = writable(null);

// 사용자 정보
function createUserStore() {
  const { subscribe, set, update } = writable(null);

  return {
    subscribe,
    set,
    update,
    login: (userData, token) => {
      localStorage.setItem('auth_token', token);
      set(userData);
    },
    logout: () => {
      localStorage.removeItem('auth_token');
      set(null);
    },
    // 페이지 로드 시 토큰에서 유저 정보 복원
    init: async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      try {
        const apiUrl = import.meta.env.PROD 
          ? window.location.origin 
          : 'http://localhost:3000';
          
        const response = await fetch(`${apiUrl}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          set(userData);
        } else {
          // 토큰 만료 또는 무효
          localStorage.removeItem('auth_token');
        }
      } catch (error) {
        console.error('Failed to restore user session:', error);
        localStorage.removeItem('auth_token');
      }
    }
  };
}

export const user = createUserStore();
