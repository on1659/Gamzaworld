/**
 * JWT 유틸리티
 */

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'gamzaworld-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d'; // 7일

/**
 * JWT 토큰 생성
 */
export function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    username: user.username
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * JWT 토큰 검증
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Express 미들웨어: JWT 인증
 */
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const user = verifyToken(token);
  
  if (!user) {
    return res.status(403).json({ error: 'Invalid token' });
  }

  req.user = user;
  next();
}
