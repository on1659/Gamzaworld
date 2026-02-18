/**
 * 테마 설정 파일
 * 
 * 리소스를 교체하려면:
 * 1. /public/assets/characters/custom 폴더에 이미지 추가
 * 2. current: 'custom'으로 변경
 * 
 * 모든 게임이 이 설정을 참조함
 */

export const THEME = {
  current: 'default',
  
  // 리소스 경로 (public 기준)
  paths: {
    characters: '/assets/characters',
    ui: '/assets/ui',
    sounds: '/assets/sounds'
  },
  
  // 현재 테마의 실제 경로
  get characterPath() {
    return `${this.paths.characters}/${this.current}`;
  },
  
  get uiPath() {
    return `${this.paths.ui}/${this.current}`;
  },
  
  get soundPath() {
    return `${this.paths.sounds}/${this.current}`;
  }
};

/**
 * 캐릭터 애니메이션 프레임
 * 파일명 규칙: idle.png, jump.png, celebrate.png, sad.png
 */
export const CHARACTER_FRAMES = {
  idle: 'idle.png',
  jump: 'jump.png',
  celebrate: 'celebrate.png',
  sad: 'sad.png'
};

/**
 * UI 에셋
 */
export const UI_ASSETS = {
  button: 'button.png',
  background: 'bg.png',
  panel: 'panel.png'
};
