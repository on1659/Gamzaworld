/**
 * GameSession - 게임 세션 베이스 클래스
 * 서버/클라이언트 공용 게임 로직
 */

export class GameSession {
  constructor(sessionId, gameId, mode = 'single') {
    this.sessionId = sessionId;
    this.gameId = gameId;
    this.mode = mode; // 'single' | 'versus'
    this.players = new Map();
    this.state = 'waiting'; // 'waiting' | 'playing' | 'finished'
    this.startTime = null;
    this.endTime = null;
  }

  /**
   * 플레이어 추가
   */
  addPlayer(playerId, playerData) {
    this.players.set(playerId, {
      id: playerId,
      username: playerData.username || `Player${this.players.size + 1}`,
      score: 0,
      state: {},
      ready: false,
      ...playerData
    });
  }

  /**
   * 게임 시작
   */
  start() {
    if (this.state !== 'waiting') {
      throw new Error('Game already started');
    }

    // 싱글 모드: 1명만, versus 모드: 2명 필요
    if (this.mode === 'versus' && this.players.size < 2) {
      throw new Error('Not enough players');
    }

    this.state = 'playing';
    this.startTime = Date.now();
    return this.getState();
  }

  /**
   * 입력 처리 (하위 클래스에서 구현)
   */
  handleInput(playerId, input) {
    throw new Error('handleInput must be implemented by game');
  }

  /**
   * 게임 상태 업데이트 (하위 클래스에서 구현)
   */
  update(deltaTime) {
    throw new Error('update must be implemented by game');
  }

  /**
   * 게임 종료
   */
  end() {
    this.state = 'finished';
    this.endTime = Date.now();
    return this.getFinalResults();
  }

  /**
   * 현재 게임 상태 반환
   */
  getState() {
    return {
      sessionId: this.sessionId,
      gameId: this.gameId,
      mode: this.mode,
      state: this.state,
      players: Array.from(this.players.values()),
      startTime: this.startTime,
      endTime: this.endTime
    };
  }

  /**
   * 최종 결과 반환
   */
  getFinalResults() {
    const results = Array.from(this.players.values())
      .map(p => ({
        playerId: p.id,
        username: p.username,
        score: p.score
      }))
      .sort((a, b) => b.score - a.score);

    return {
      ...this.getState(),
      results,
      winner: results[0]
    };
  }

  /**
   * 플레이어별 상태 반환 (상대방 화면용)
   */
  getPlayerState(playerId) {
    const player = this.players.get(playerId);
    if (!player) return null;

    return {
      playerId,
      username: player.username,
      score: player.score,
      state: player.state
    };
  }
}
