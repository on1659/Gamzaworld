/**
 * GameSessionManager - 서버 측 게임 세션 관리
 * (게임 로직은 추후 추가)
 */

class GameSessionManager {
  constructor() {
    this.sessions = new Map();
    this.playerSessions = new Map();
    this.gameClasses = {
      // 게임 로직 추가 예정
    };
  }

  createSession(gameId, mode = 'single') {
    console.log(`[GameSession] Game logic not implemented yet: ${gameId}`);
    return null;
  }

  joinSession(sessionId, playerId, playerData) {
    console.log(`[GameSession] Join not implemented yet`);
    return null;
  }

  startSession(sessionId) {
    console.log(`[GameSession] Start not implemented yet`);
    return null;
  }

  handleInput(playerId, input) {
    return null;
  }

  leaveSession(playerId) {
    console.log(`[GameSession] Leave: ${playerId}`);
  }

  getSession(sessionId) {
    return null;
  }

  getPlayerSession(playerId) {
    return null;
  }
}

// Singleton
export const gameSessionManager = new GameSessionManager();
