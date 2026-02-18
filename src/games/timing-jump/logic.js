/**
 * TimingJump 게임 로직
 * 서버/클라이언트 공용
 */

import { GameSession } from '../shared/GameSession.js';

export class TimingJumpSession extends GameSession {
  constructor(sessionId, mode = 'single') {
    super(sessionId, 'timing-jump', mode);
    
    // 게임 설정
    this.config = {
      gravity: 0.8,
      jumpPower: -15,
      obstacleSpeed: 5,
      obstacleSpawnInterval: 2000, // 2초마다
      playerX: 100
    };

    // 게임 오브젝트
    this.obstacles = [];
    this.lastObstacleTime = 0;
  }

  /**
   * 플레이어 초기화
   */
  addPlayer(playerId, playerData) {
    super.addPlayer(playerId, playerData);
    
    const player = this.players.get(playerId);
    player.state = {
      y: 300,
      velocityY: 0,
      isJumping: false,
      distance: 0
    };
  }

  /**
   * 입력 처리
   */
  handleInput(playerId, input) {
    const player = this.players.get(playerId);
    if (!player || this.state !== 'playing') return;

    if (input.type === 'jump' && !player.state.isJumping) {
      player.state.velocityY = this.config.jumpPower;
      player.state.isJumping = true;
    }
  }

  /**
   * 게임 업데이트 (매 프레임)
   */
  update(deltaTime) {
    if (this.state !== 'playing') return;

    const currentTime = Date.now();

    // 장애물 생성
    if (currentTime - this.lastObstacleTime > this.config.obstacleSpawnInterval) {
      this.spawnObstacle();
      this.lastObstacleTime = currentTime;
    }

    // 각 플레이어 업데이트
    for (const [playerId, player] of this.players) {
      this.updatePlayer(player, deltaTime);
      
      // 충돌 체크
      if (this.checkCollision(player)) {
        this.onPlayerDeath(playerId);
      }
    }

    // 장애물 이동
    this.updateObstacles(deltaTime);
  }

  /**
   * 플레이어 물리 업데이트
   */
  updatePlayer(player, deltaTime) {
    // 중력 적용
    player.state.velocityY += this.config.gravity;
    player.state.y += player.state.velocityY;

    // 바닥 체크
    if (player.state.y >= 300) {
      player.state.y = 300;
      player.state.velocityY = 0;
      player.state.isJumping = false;
    }

    // 거리 증가 (점수)
    player.state.distance += this.config.obstacleSpeed * deltaTime / 100;
    player.score = Math.floor(player.state.distance);
  }

  /**
   * 장애물 생성
   */
  spawnObstacle() {
    this.obstacles.push({
      x: 800,
      y: 300,
      width: 30,
      height: 50
    });
  }

  /**
   * 장애물 업데이트
   */
  updateObstacles(deltaTime) {
    // 장애물 이동
    for (const obstacle of this.obstacles) {
      obstacle.x -= this.config.obstacleSpeed;
    }

    // 화면 밖 장애물 제거
    this.obstacles = this.obstacles.filter(o => o.x > -50);
  }

  /**
   * 충돌 체크
   */
  checkCollision(player) {
    const playerBox = {
      x: this.config.playerX,
      y: player.state.y,
      width: 40,
      height: 40
    };

    for (const obstacle of this.obstacles) {
      if (
        playerBox.x < obstacle.x + obstacle.width &&
        playerBox.x + playerBox.width > obstacle.x &&
        playerBox.y < obstacle.y + obstacle.height &&
        playerBox.y + playerBox.height > obstacle.y
      ) {
        return true;
      }
    }

    return false;
  }

  /**
   * 플레이어 사망
   */
  onPlayerDeath(playerId) {
    const player = this.players.get(playerId);
    if (!player) return;

    // 싱글 모드: 게임 종료
    if (this.mode === 'single') {
      this.end();
    }
    // versus 모드: 해당 플레이어만 종료, 다른 플레이어 계속
    else {
      player.state.dead = true;
      
      // 모든 플레이어 사망 시 게임 종료
      const allDead = Array.from(this.players.values()).every(p => p.state.dead);
      if (allDead) {
        this.end();
      }
    }
  }

  /**
   * 상태 반환 (렌더링용)
   */
  getState() {
    return {
      ...super.getState(),
      obstacles: this.obstacles,
      config: this.config
    };
  }
}
