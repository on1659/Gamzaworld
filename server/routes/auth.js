/**
 * Auth 라우트
 */

import express from 'express';
import passport from 'passport';
import { generateToken } from '../auth/jwt.js';

const router = express.Router();

/**
 * GET /auth/google
 * Google OAuth 시작
 */
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false 
  })
);

/**
 * GET /auth/google/callback
 * Google OAuth 콜백
 */
router.get('/google/callback',
  passport.authenticate('google', { 
    session: false,
    failureRedirect: '/login?error=auth_failed'
  }),
  (req, res) => {
    // JWT 토큰 생성
    const token = generateToken(req.user);
    
    // 프론트엔드로 리다이렉트 (토큰 전달)
    const redirectUrl = process.env.NODE_ENV === 'production'
      ? `${process.env.FRONTEND_URL}/auth/callback?token=${token}`
      : `http://localhost:5173/auth/callback?token=${token}`;
    
    res.redirect(redirectUrl);
  }
);

/**
 * GET /auth/me
 * 현재 로그인한 유저 정보
 */
import { authenticateToken } from '../auth/jwt.js';
import { getUserById } from '../db/users.js';

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // 민감한 정보 제외
    const { google_id, ...userInfo } = user;
    res.json(userInfo);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /auth/logout
 * 로그아웃 (클라이언트에서 토큰 삭제)
 */
router.post('/logout', (req, res) => {
  res.json({ success: true });
});

export default router;
