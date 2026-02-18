/**
 * 전역 상태 관리 (Svelte stores)
 */

import { writable } from 'svelte/store';

// 현재 페이지
export const currentPage = writable('lobby');

// 현재 게임 컴포넌트
export const currentGame = writable(null);

// 사용자 정보
export const user = writable(null);
