/**
 * GameSessionManager - 서버 측 게임 세션 관리
 */

import { TimingJumpSession } from '../../src/games/timing-jump/logic.js';

class GameSessionManager {
  constructor() {
    this.sessions = new Map(); // sessionId -> GameSession
    this.playerSessions = new Map(); // playerId (socket.id) -> sessionId
    this.tickRate = 60; // 60 FPS
    this.gameClasses = {
      'timing-jump': TimingJumpSession,
      // 나중에 추가: 'rhythm-tap', 'stack-tower'
    };
  }

  /**
   * 게임 세션 생성
   */
  createSession(gameId, mode = 'single') {
    const GameClass = this.gameClasses[gameId];
    if (!GameClass) {
      throw new Error(`Unknown game: ${gameId}`);
    }

    const sessionId = this.generateSessionId();
    const session = new GameClass(sessionId, mode);
    
    this.sessions.set(sessionId, session);
    
    console.log(`[GameSession] Created: ${sessionId} (${gameId}, ${mode})`);
    return session;
  }

  /**
   * 플레이어를 세션에 추가
   */
  joinSession(sessionId, playerId, playerData) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    session.addPlayer(playerId, playerData);
    this.playerSessions.set(playerId, sessionId);

    console.log(`[GameSession] Player ${playerId} joined ${sessionId}`);
    return session;
  }

  /**
   * 게임 시작
   */
  startSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    session.start();
    this.startGameLoop(sessionId);

    console.log(`[GameSession] Started: ${sessionId}`);
    return session.getState();
  }

  /**
   * 입력 처리
   */
  handleInput(playerId, input) {
    const sessionId = this.playerSessions.get(playerId);
    if (!sessionId) {
      console.warn(`[GameSession] Player ${playerId} not in any session`);
      return null;
    }

    const session = this.sessions.get(sessionId);
    if (!session) return null;

    session.handleInput(playerId, input);
    return session.getState();
  }

  /**
   * 게임 루프 시작
   */
  startGameLoop(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    let lastTime = Date.now();
    const deltaTime = 1000 / this.tickRate;

    const interval = setInterval(() => {
      const currentTime = Date.now();
      const dt = currentTime - lastTime;
      lastTime = currentTime;

      session.update(dt);

      // 게임 종료 시 루프 중단
      if (session.state === 'finished') {
        clearInterval(interval);
        this.onSessionEnd(sessionId);
      }
    }, deltaTime);

    session.intervalId = interval;
  }

  /**
   * 세션 종료 처리
   */
  onSessionEnd(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    console.log(`[GameSession] Ended: ${sessionId}`);
    
    // 플레이어 매핑 제거
    for (const [playerId, sid] of this.playerSessions) {
      if (sid === sessionId) {
        this.playerSessions.delete(playerId);
      }
    }

    // 세션 삭제 (일정 시간 후)
    setTimeout(() => {
      this.sessions.delete(sessionId);
      console.log(`[GameSession] Deleted: ${sessionId}`);
    }, 60000); // 1분 후 삭제
  }

  /**
   * 플레이어 세션 나가기
   */
  leaveSession(playerId) {
    const sessionId = this.playerSessions.get(playerId);
    if (!sessionId) return;

    const session = this.sessions.get(sessionId);
    if (session) {
      session.players.delete(playerId);
      
      // 플레이어가 없으면 세션 종료
      if (session.players.size === 0) {
        if (session.intervalId) {
          clearInterval(session.intervalId);
        }
        this.sessions.delete(sessionId);
        console.log(`[GameSession] Deleted (empty): ${sessionId}`);
      }
    }

    this.playerSessions.delete(playerId);
  }

  /**
   * 세션 상태 조회
   */
  getSession(sessionId) {
    return this.sessions.get(sessionId);
  }

  /**
   * 플레이어의 현재 세션 조회
   */
  getPlayerSession(playerId) {
    const sessionId = this.playerSessions.get(playerId);
    return sessionId ? this.sessions.get(sessionId) : null;
  }

  /**
   * 세션 ID 생성
   */
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Singleton
export const gameSessionManager = new GameSessionManager();
