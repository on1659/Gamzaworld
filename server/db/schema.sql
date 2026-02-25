-- Gamzaworld Database Schema

-- Users 테이블
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  google_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) NOT NULL,
  avatar_url TEXT,
  level INTEGER DEFAULT 1,
  tier VARCHAR(50) DEFAULT 'bronze',
  total_score INTEGER DEFAULT 0,
  games_played INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Achievements 테이블
CREATE TABLE IF NOT EXISTS achievements (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  condition_type VARCHAR(50),
  condition_value INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Achievements (유저별 업적 달성)
CREATE TABLE IF NOT EXISTS user_achievements (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  achievement_id INTEGER REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, achievement_id)
);

-- Game Scores (게임별 점수)
CREATE TABLE IF NOT EXISTS game_scores (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  game_id VARCHAR(50) NOT NULL,
  score INTEGER NOT NULL,
  player_name VARCHAR(100) DEFAULT '게스트',
  played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_game_scores_user ON game_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_game_scores_game_score ON game_scores(game_id, score DESC);

-- 기본 업적 데이터
INSERT INTO achievements (name, description, icon, condition_type, condition_value) VALUES
  ('첫 걸음', '첫 게임 플레이', '🎯', 'games_played', 1),
  ('100점 돌파', '100점 이상 달성', '💯', 'score', 100),
  ('연속 10일', '10일 연속 플레이', '🔥', 'login_streak', 10),
  ('전체 1위', '랭킹 1위 달성', '👑', 'rank', 1),
  ('다이아 티어', '다이아 티어 달성', '💎', 'tier', 5)
ON CONFLICT DO NOTHING;
