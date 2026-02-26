/**
 * 타이밍 점프 게임 로직 (서버/클라이언트 공용)
 *
 * 좌표계:
 *   playerY = 0  → 지면
 *   playerY < 0  → 공중 (위로 올라갈수록 음수)
 */

export const GAME_CONFIG = {
  // 물리
  gravity: 0.6,
  jumpForce: -11,

  // 플레이어
  playerX: 80,
  playerWidth: 30,
  playerHeight: 40,

  // 게임 영역
  gameWidth: 600,
  gameHeight: 250,

  // 장애물
  obstacleWidth: 28,
  obstacleMinHeight: 30,
  obstacleMaxHeight: 80,

  // 속도
  initialSpeed: 22,
  speedIncrement: 0.004,
};

export class TimingJumpGame {
  constructor() {
    this.reset();
  }

  reset() {
    this.playerY = 0;         // 0 = 지면, 음수 = 공중
    this.playerVY = 0;        // 수직 속도
    this.isOnGround = true;
    this.obstacles = [];
    this.score = 0;
    this.frameCount = 0;
    this.speed = GAME_CONFIG.initialSpeed;
    this.status = 'running';  // 'running' | 'gameover'
    this.nextObstacleIn = 100;
    this._obstacleIdCounter = 0;
  }

  /**
   * 점프 시도 (지면에 있을 때만 유효)
   */
  jump() {
    if (this.isOnGround && this.status === 'running') {
      this.playerVY = GAME_CONFIG.jumpForce;
      this.isOnGround = false;
      return true;
    }
    return false;
  }

  /**
   * 한 프레임 업데이트
   * @returns {Object} 현재 게임 상태
   */
  update() {
    if (this.status !== 'running') return this.getState();

    this.frameCount++;
    this.speed = GAME_CONFIG.initialSpeed + this.frameCount * GAME_CONFIG.speedIncrement;

    // ── 플레이어 물리 ──────────────────────────────
    if (!this.isOnGround) {
      this.playerVY += GAME_CONFIG.gravity;
      this.playerY += this.playerVY;

      if (this.playerY >= 0) {
        this.playerY = 0;
        this.playerVY = 0;
        this.isOnGround = true;
      }
    }

    // ── 장애물 스폰 ───────────────────────────────
    this.nextObstacleIn--;
    if (this.nextObstacleIn <= 0) {
      const minH = GAME_CONFIG.obstacleMinHeight;
      const maxH = GAME_CONFIG.obstacleMaxHeight;
      const height = Math.floor(minH + Math.random() * (maxH - minH));

      this.obstacles.push({
        id: ++this._obstacleIdCounter,
        x: GAME_CONFIG.gameWidth,
        width: GAME_CONFIG.obstacleWidth,
        height,
        passed: false,
      });

      // 점점 빠르게 스폰 (최소 35프레임 간격)
      this.nextObstacleIn = Math.max(35, 100 - Math.floor(this.frameCount / 80));
    }

    // ── 장애물 이동 + 통과 판정 ───────────────────
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      obs.x -= this.speed;

      // 통과 점수
      if (!obs.passed && obs.x + obs.width < GAME_CONFIG.playerX) {
        obs.passed = true;
        this.score += 10;
      }

      // 화면 밖 제거
      if (obs.x + obs.width < 0) {
        this.obstacles.splice(i, 1);
      }
    }

    // ── 충돌 감지 ─────────────────────────────────
    if (this._checkCollision()) {
      this.status = 'gameover';
    }

    // ── 거리 점수 (매 5프레임 1점) ─────────────────
    if (this.frameCount % 5 === 0) {
      this.score += 1;
    }

    return this.getState();
  }

  /**
   * AABB 충돌 감지
   * 플레이어와 장애물 간 사각형 충돌 체크 (4px 여유)
   */
  _checkCollision() {
    const { playerX, playerWidth, playerHeight } = GAME_CONFIG;
    const margin = 4;

    // 플레이어 바운딩 박스 (지면 기준 좌표)
    const pLeft  = playerX + margin;
    const pRight = playerX + playerWidth - margin;
    const pBottom = this.playerY;                    // 0 = 지면
    const pTop    = this.playerY - playerHeight;     // 음수 = 위쪽

    for (const obs of this.obstacles) {
      // 장애물 바운딩 박스 (지면 기준)
      const oLeft   = obs.x + margin;
      const oRight  = obs.x + obs.width - margin;
      const oBottom = 0;                // 장애물 아래 = 지면
      const oTop    = -obs.height;      // 장애물 위 = 음수

      const overlapX = pRight > oLeft && pLeft < oRight;
      const overlapY = pBottom > oTop && pTop < oBottom;

      if (overlapX && overlapY) return true;
    }
    return false;
  }

  /**
   * 직렬화 가능한 현재 상태 반환
   */
  getState() {
    return {
      playerY:    this.playerY,
      playerVY:   this.playerVY,
      isOnGround: this.isOnGround,
      obstacles:  this.obstacles.map(o => ({
        id:     o.id,
        x:      o.x,
        width:  o.width,
        height: o.height,
        passed: o.passed,
      })),
      score:      this.score,
      speed:      this.speed,
      frameCount: this.frameCount,
      status:     this.status,
    };
  }
}
