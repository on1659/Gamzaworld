# Google OAuth 설정 가이드

## 1. Google Cloud Console 설정

### 1.1 프로젝트 생성
1. https://console.cloud.google.com 접속
2. 프로젝트 선택 → "새 프로젝트" 클릭
3. 프로젝트 이름: "Gamzaworld" 입력
4. "만들기" 클릭

### 1.2 OAuth 동의 화면 설정
1. 좌측 메뉴 → "API 및 서비스" → "OAuth 동의 화면"
2. 사용자 유형: **외부** 선택
3. "만들기" 클릭
4. 앱 정보 입력:
   - 앱 이름: `Gamzaworld`
   - 사용자 지원 이메일: (본인 이메일)
   - 개발자 연락처: (본인 이메일)
5. "저장 후 계속" 클릭
6. 범위 추가:
   - ".../auth/userinfo.email" 추가
   - ".../auth/userinfo.profile" 추가
7. "저장 후 계속" → "대시보드로 돌아가기"

### 1.3 OAuth 클라이언트 ID 생성
1. 좌측 메뉴 → "사용자 인증 정보"
2. "사용자 인증 정보 만들기" → "OAuth 클라이언트 ID"
3. 애플리케이션 유형: **웹 애플리케이션**
4. 이름: `Gamzaworld Web`
5. 승인된 리디렉션 URI:
   - 로컬 개발: `http://localhost:3000/auth/google/callback`
   - Railway 배포: `https://your-app.up.railway.app/auth/google/callback`
6. "만들기" 클릭
7. **클라이언트 ID**와 **클라이언트 보안 비밀** 복사!

---

## 2. 환경 변수 설정

### 로컬 개발 (.env)
```bash
cp .env.example .env
```

`.env` 파일 편집:
```env
GOOGLE_CLIENT_ID=복사한_클라이언트_ID
GOOGLE_CLIENT_SECRET=복사한_보안_비밀
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
JWT_SECRET=random-secret-key-here
```

### Railway 배포
Railway 대시보드 → Variables 탭:
```
GOOGLE_CLIENT_ID=복사한_클라이언트_ID
GOOGLE_CLIENT_SECRET=복사한_보안_비밀
GOOGLE_CALLBACK_URL=https://your-app.up.railway.app/auth/google/callback
JWT_SECRET=production-secret-key
FRONTEND_URL=https://your-app.up.railway.app
```

---

## 3. 데이터베이스 초기화

### Railway PostgreSQL에서 실행:
```bash
railway run psql $DATABASE_URL < server/db/schema.sql
```

또는 Railway 대시보드 → PostgreSQL → Data 탭에서 직접 SQL 실행

---

## 4. 테스트

### 로컬:
1. `npm run dev` (클라이언트)
2. `npm run server:dev` (서버)
3. http://localhost:5173 접속
4. "구글로 로그인" 클릭
5. 구글 계정 선택 → 권한 승인
6. 로그인 성공!

### 배포:
1. Railway 도메인 접속
2. "구글로 로그인" 클릭
3. 정상 작동 확인

---

## 트러블슈팅

### "redirect_uri_mismatch" 에러
- Google Cloud Console에서 Redirect URI가 정확히 입력되었는지 확인
- 로컬: `http://localhost:3000/auth/google/callback`
- 배포: `https://your-actual-domain.up.railway.app/auth/google/callback`

### 토큰 만료
- JWT_SECRET이 Railway와 로컬에서 다를 경우 발생
- localStorage 클리어 후 재로그인

### DB 연결 실패
- Railway DATABASE_URL이 자동 주입되는지 확인
- `server/db/schema.sql` 실행 확인
