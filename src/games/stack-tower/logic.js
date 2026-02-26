/**
 * 스택 타워 게임 로직 (클라이언트 사이드)
 *
 * 움직이는 블록을 타이밍 맞춰 쌓는 게임!
 */

export const GAME_CONFIG = {
  gameWidth: 300,
  gameHeight: 500,

  // 타워
  towerX: 75,         // 타워 중심 X
  baseBlockWidth: 150, // 첫 블록 너비
  blockHeight: 20,
  minBlockWidth: 20,

  // 움직임
  initialSpeed: 3,
  speedIncrement: 0.15, // 레벨당 속도 증가
};

export class StackTowerGame {
  constructor() {
    this.reset();
  }

  reset() {
    const { gameWidth, towerX, baseBlockWidth, blockHeight, gameHeight } = GAME_CONFIG;

    this.status = 'waiting'; // 'waiting' | 'running' | 'gameover'
    this.score = 0;
    this.level = 0;

    // 쌓인 블록들
    this.stackedBlocks = [{
      x: towerX - baseBlockWidth / 2,
      y: gameHeight - blockHeight,
      width: baseBlockWidth,
    }];

    // 현재 움직이는 블록
    this.currentBlock = this._createMovingBlock();
    this.direction = 1; // 1: 오른쪽, -1: 왼쪽
    this.speed = GAME_CONFIG.initialSpeed;
  }

  _createMovingBlock() {
    const { gameWidth, blockHeight, gameHeight } = GAME_CONFIG;
    const prevBlock = this.stackedBlocks[this.stackedBlocks.length - 1];
    const yPos = prevBlock.y - blockHeight;

    return {
      x: 0,
      y: yPos,
      width: prevBlock.width,
    };
  }

  drop() {
    if (this.status === 'waiting') {
      this.status = 'running';
      return null;
    }
    if (this.status !== 'running') return null;

    const prev = this.stackedBlocks[this.stackedBlocks.length - 1];
    const curr = this.currentBlock;

    // 겹치는 영역 계산
    const overlapLeft = Math.max(prev.x, curr.x);
    const overlapRight = Math.min(prev.x + prev.width, curr.x + curr.width);
    const overlapWidth = overlapRight - overlapLeft;

    if (overlapWidth <= 0) {
      // 완전히 빗나감 - 게임 오버
      this.status = 'gameover';
      return { perfect: false, gameover: true };
    }

    const isPerfect = Math.abs(overlapWidth - prev.width) < 3 && Math.abs(overlapWidth - curr.width) < 3;

    // 블록을 스택에 추가
    this.stackedBlocks.push({
      x: overlapLeft,
      y: curr.y,
      width: overlapWidth,
    });

    this.score += isPerfect ? 200 : Math.round(overlapWidth * 2);
    this.level++;

    // 속도 증가
    this.speed = GAME_CONFIG.initialSpeed + this.level * GAME_CONFIG.speedIncrement;

    // 다음 블록 생성
    this.currentBlock = this._createMovingBlock();
    this.direction = 1;

    // 카메라 스크롤: 타워가 너무 높으면 scrollOffset 증가
    const topBlock = this.stackedBlocks[this.stackedBlocks.length - 1];
    if (topBlock.y < 150) {
      const shift = 150 - topBlock.y;
      this.stackedBlocks.forEach(b => b.y += shift);
      this.currentBlock.y += shift;
    }

    return { perfect: isPerfect, gameover: false, score: this.score };
  }

  update() {
    if (this.status !== 'running') return this.getState();

    const { gameWidth } = GAME_CONFIG;
    const curr = this.currentBlock;

    curr.x += this.speed * this.direction;

    // 벽 반사
    if (curr.x < -curr.width / 2) {
      curr.x = -curr.width / 2;
      this.direction = 1;
    } else if (curr.x + curr.width > gameWidth + curr.width / 2) {
      curr.x = gameWidth + curr.width / 2 - curr.width;
      this.direction = -1;
    }

    return this.getState();
  }

  getState() {
    return {
      status: this.status,
      score: this.score,
      level: this.level,
      stackedBlocks: this.stackedBlocks.map(b => ({ ...b })),
      currentBlock: { ...this.currentBlock },
      speed: this.speed,
    };
  }
}
