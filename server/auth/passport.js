/**
 * Passport Google OAuth 설정
 */

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { getUserByGoogleId, createUser } from '../db/users.js';

export function setupPassport() {
  // Google OAuth 환경변수가 없으면 스킽
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.warn('⚠️  Google OAuth credentials not found. Login disabled.');
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback'
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Google 프로필에서 정보 추출
          const googleId = profile.id;
          const email = profile.emails[0].value;
          const username = profile.displayName;
          const avatarUrl = profile.photos[0]?.value;

          // 기존 유저 찾기
          let user = await getUserByGoogleId(googleId);

          if (!user) {
            // 새 유저 생성
            user = await createUser({
              googleId,
              email,
              username,
              avatarUrl
            });
          }

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  // 세션 직렬화 (사용하지 않지만 passport 필수)
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    // JWT 사용하므로 실제로는 호출되지 않음
    done(null, { id });
  });
}
