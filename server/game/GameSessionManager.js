/**
 * GameSessionManager - 서버 측 게임 세션 관리
 */

import { TimingJumpGame } from '../../src/games/timing-jump/logic.js';

// ────────────────────────────────────────────────────────────
// GameSession: 하나의 게임 판
// ────────────────────────────────────────────────────────────
class GameSession {
  constructor(sessionId, gameId, mode) {
    this.sessionId = sessionId;
    this.gameId    = gameId;
    this.mode      = mode;
    this.players   = new Map(); // socketId → playerData
    this.state     = 'waiting'; // waiting | running | finished
    this.game      = null;
  }

  addPlayer(socketId, playerData) {
    this.players.set(socketId, { socketId, ...(playerData || {}) });
  }

  /** 게임 시작 → 초기 상태 반환 */
  start() {
    this.state = 'running';
    return this.game.getState();
  }

  /**
   * 한 프레임 업데이트 후 상태 반환
   * (서버 게임 루프에서 30fps로 호출)
   */
  update() {
    if (this.state !== 'running' || !this.game) {
      return this.game ? this.game.getState() : null;
    }

    const newState = this.game.update();

    if (newState.status === 'gameover') {
      this.state = 'finished';
    }

    return newState;
  }

  getState() {
    return this.game ? this.game.getState() : null;
  }

  /** 플레이어 입력 처리 */
  handleInput(socketId, input) {
    if (this.state !== 'running' || !this.game) return null;

    if (input.type === 'jump') {
      this.game.jump();
    }

    // 입력만 반영하고, 상태 전송은 게임 루프에서 처리
    return null;
  }

  end() {
    this.state = 'finished';
    if (this.game) this.game.status = 'gameover';
  }

  getFinalResults() {
    return {
      score:   this.game ? this.game.score : 0,
      gameId:  this.gameId,
      players: Array.from(this.players.values()),
    };
  }
}

// ────────────────────────────────────────────────────────────
// GameSessionManager: 전체 세션 관리
// ────────────────────────────────────────────────────────────
class GameSessionManager {
  constructor() {
    this.sessions       = new Map(); // sessionId → GameSession
    this.playerSessions = new Map(); // socketId  → sessionId
  }

  /**
   * 새 게임 세션 생성
   * @returns {GameSession|null}
   */
  createSession(gameId, mode = 'single') {
    const sessionId = `${gameId}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const session   = new GameSession(sessionId, gameId, mode);

    if (gameId === 'timing-jump') {
      session.game = new TimingJumpGame();
    } else {
      console.warn(`[GameSession] 알 수 없는 게임: ${gameId}`);
      return null;
    }

    this.sessions.set(sessionId, session);
    console.log(`[GameSession] 생성: ${sessionId}`);
    return session;
  }

  joinSession(sessionId, socketId, playerData) {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    session.addPlayer(socketId, playerData);
    this.playerSessions.set(socketId, sessionId);
    return session;
  }

  startSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) return null;
    return session.start();
  }

  handleInput(socketId, input) {
    const session = this.getPlayerSession(socketId);
    if (!session) return null;
    return session.handleInput(socketId, input);
  }

  leaveSession(socketId) {
    const sessionId = this.playerSessions.get(socketId);
    if (sessionId) {
      const session = this.sessions.get(sessionId);
      if (session) {
        session.end();
        this.sessions.delete(sessionId);
      }
      this.playerSessions.delete(socketId);
    }
    console.log(`[GameSession] 퇴장: ${socketId}`);
  }

  getSession(sessionId) {
    return this.sessions.get(sessionId) ?? null;
  }

  getPlayerSession(socketId) {
    const sessionId = this.playerSessions.get(socketId);
    return sessionId ? (this.sessions.get(sessionId) ?? null) : null;
  }
}

// Singleton
export const gameSessionManager = new GameSessionManager();
