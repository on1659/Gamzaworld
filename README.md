# 🎮 Gamzaworld

귀여운 캐릭터 기반 타이밍/피지컬 미니게임 천국

## 🎯 컨셉

- **타겟층**: 전연령, 타이밍 게임 & 피지컬 게임 선호
- **게임 방식**: 싱글 게임 + 글로벌 랭킹 경쟁
- **핵심 차별점**: 업적/아이콘/레벨 시스템으로 성장 과시

## 🕹 게임 목록

1. **타이밍 점프** - 장애물 피하며 최대한 멀리
2. **리듬 탭** - 떨어지는 노트 타이밍 맞추기
3. **스택 타워** - 타이밍 맞춰 블록 쌓기

## 🏆 주요 기능

- ✅ 로비 (게임 선택)
- ✅ 랭킹 시스템
- ✅ 전체 채팅 (실시간)
- ✅ 프로필 & 업적
- 🚧 게임 플레이 (개발 예정)
- 🚧 데이터베이스 연동 (PostgreSQL)

## 🛠 기술 스택

- **Frontend**: Svelte 5 + Vite
- **Backend**: Express + Socket.IO
- **Database**: PostgreSQL
- **Deploy**: Railway

## 🎨 리소스 교체 방법

리소스(캐릭터, UI, 사운드)는 모듈화되어 쉽게 교체 가능:

1. `/public/assets/characters/custom` 폴더 생성
2. 이미지 파일 추가 (idle.png, jump.png, celebrate.png, sad.png)
3. `/src/config/theme.js`에서 `current: 'custom'`으로 변경

## 📦 설치 및 실행

```bash
# 설치
npm install

# 개발 서버 (프론트엔드)
npm run dev

# 백엔드 서버 (개발)
npm run server:dev

# 프로덕션 빌드
npm run build

# 프로덕션 실행
npm start
```

## 🚀 배포

Railway로 자동 배포됨:
- GitHub 푸시 → Railway 자동 빌드 & 배포
- PostgreSQL 플러그인 자동 연결

## 📝 TODO

- [ ] 게임 로직 구현 (타이밍 점프, 리듬 탭, 스택 타워)
- [ ] 데이터베이스 스키마 설계 & 마이그레이션
- [ ] 사용자 인증 시스템
- [ ] 랭킹 API 연동
- [ ] 업적 시스템 백엔드
- [ ] 캐릭터 리소스 제작
- [ ] 사운드 이펙트 추가
- [ ] PWA 지원

## 📄 License

MIT
