/**
 * 리듬 탭 게임 로직 (서버/클라이언트 공용)
 *
 * 떨어지는 노트를 타이밍 맞춰 탭!
 */

export const GAME_CONFIG = {
  // 게임 영역
  gameWidth: 600,
  gameHeight: 400,

  // 레인 (4레인)
  laneCount: 4,
  laneWidth: 120,  // 600 / 4 = 150, 여백 고려 120
  laneSpacing: 30,

  // 노트
  noteHeight: 20,
  noteSpeed: 3,      // 초기 속도 (픽셀/프레임)
  speedIncrement: 0.0005, // 프레임당 속도 증가

  // 타겟 존 (판정 라인)
  targetY: 320,      // 화면 하단 근처
  targetHeight: 40,

  // 판정 범위 (타겟 존 중심 기준)
  perfectRange: 15,  // ±15px → Perfect
  greatRange: 30,    // ±30px → Great
  goodRange: 50,     // ±50px → Good

  // 점수
  perfectScore: 100,
  greatScore: 50,
  goodScore: 20,
  missScore: 0,

  // 콤보 보너스
  comboMultiplier: {
    10: 1.2,
    20: 1.5,
    50: 2.0,
  },
};

export class RhythmTapGame {
  constructor() {
    this.reset();
  }

  reset() {
    this.notes = [];
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.frameCount = 0;
    this.speed = GAME_CONFIG.noteSpeed;
    this.status = 'running';  // 'running' | 'gameover'
    this.nextNoteIn = 60;     // 프레임 카운트
    this._noteIdCounter = 0;

    this.stats = {
      perfect: 0,
      great: 0,
      good: 0,
      miss: 0,
    };
  }

  /**
   * 노트 탭 시도
   * @param {number} lane - 0~3 레인 인덱스
   * @returns {Object|null} 판정 결과 { judgment, score, combo }
   */
  tap(lane) {
    if (this.status !== 'running') return null;
    if (lane < 0 || lane >= GAME_CONFIG.laneCount) return null;

    // 해당 레인에서 타겟 존에 가장 가까운 노트 찾기
    const targetY = GAME_CONFIG.targetY;
    let closestNote = null;
    let minDistance = Infinity;

    for (const note of this.notes) {
      if (note.lane === lane && !note.hit) {
        const distance = Math.abs(note.y - targetY);
        if (distance < minDistance) {
          minDistance = distance;
          closestNote = note;
        }
      }
    }

    // 노트가 없거나 판정 범위 밖
    if (!closestNote || minDistance > GAME_CONFIG.goodRange) {
      this._breakCombo();
      return { judgment: 'miss', score: 0, combo: 0 };
    }

    // 판정
    let judgment = 'miss';
    let baseScore = 0;

    if (minDistance <= GAME_CONFIG.perfectRange) {
      judgment = 'perfect';
      baseScore = GAME_CONFIG.perfectScore;
      this.stats.perfect++;
    } else if (minDistance <= GAME_CONFIG.greatRange) {
      judgment = 'great';
      baseScore = GAME_CONFIG.greatScore;
      this.stats.great++;
    } else if (minDistance <= GAME_CONFIG.goodRange) {
      judgment = 'good';
      baseScore = GAME_CONFIG.goodScore;
      this.stats.good++;
    }

    // 노트 제거
    closestNote.hit = true;

    // 콤보 & 점수
    if (judgment !== 'miss') {
      this.combo++;
      if (this.combo > this.maxCombo) {
        this.maxCombo = this.combo;
      }

      // 콤보 배수 적용
      let multiplier = 1.0;
      for (const [threshold, mult] of Object.entries(GAME_CONFIG.comboMultiplier)) {
        if (this.combo >= parseInt(threshold)) {
          multiplier = mult;
        }
      }

      const finalScore = Math.floor(baseScore * multiplier);
      this.score += finalScore;

      return {
        judgment,
        score: finalScore,
        combo: this.combo,
        distance: minDistance,
      };
    } else {
      this._breakCombo();
      return { judgment, score: 0, combo: 0 };
    }
  }

  /**
   * 한 프레임 업데이트
   */
  update() {
    if (this.status !== 'running') return this.getState();

    this.frameCount++;
    this.speed = GAME_CONFIG.noteSpeed + this.frameCount * GAME_CONFIG.speedIncrement;

    // ── 노트 스폰 ──────────────────────────────────
    this.nextNoteIn--;
    if (this.nextNoteIn <= 0) {
      const lane = Math.floor(Math.random() * GAME_CONFIG.laneCount);
      this.notes.push({
        id: ++this._noteIdCounter,
        lane,
        y: 0,  // 화면 위에서 시작
        hit: false,
      });

      // 점점 빠르게 스폰 (최소 30프레임 간격)
      this.nextNoteIn = Math.max(30, 80 - Math.floor(this.frameCount / 100));
    }

    // ── 노트 이동 + 미스 판정 ──────────────────────
    for (let i = this.notes.length - 1; i >= 0; i--) {
      const note = this.notes[i];

      if (!note.hit) {
        note.y += this.speed;

        // 타겟 존을 지나쳐서 판정 범위 벗어나면 Miss
        if (note.y > GAME_CONFIG.targetY + GAME_CONFIG.goodRange) {
          this._breakCombo();
          this.stats.miss++;
          note.hit = true; // Miss 처리 완료
        }
      }

      // 화면 밖 제거
      if (note.y > GAME_CONFIG.gameHeight) {
        this.notes.splice(i, 1);
      }
    }

    // ── 게임 오버 조건 (60초 또는 미스 20회) ───────
    if (this.frameCount >= 60 * 60 || this.stats.miss >= 20) {
      this.status = 'gameover';
    }

    return this.getState();
  }

  _breakCombo() {
    this.combo = 0;
  }

  /**
   * 직렬화 가능한 현재 상태 반환
   */
  getState() {
    return {
      notes: this.notes.map(n => ({
        id: n.id,
        lane: n.lane,
        y: n.y,
        hit: n.hit,
      })),
      score: this.score,
      combo: this.combo,
      maxCombo: this.maxCombo,
      speed: this.speed,
      frameCount: this.frameCount,
      status: this.status,
      stats: { ...this.stats },
    };
  }
}
