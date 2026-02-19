/**
 * Users DB 관련 함수
 */

import pg from 'pg';
const { Pool } = pg;

// PostgreSQL 연결 풀
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

/**
 * Google ID로 유저 찾기
 */
export async function getUserByGoogleId(googleId) {
  const result = await pool.query(
    'SELECT * FROM users WHERE google_id = $1',
    [googleId]
  );
  return result.rows[0];
}

/**
 * 유저 ID로 찾기
 */
export async function getUserById(id) {
  const result = await pool.query(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
}

/**
 * 새 유저 생성
 */
export async function createUser({ googleId, email, username, avatarUrl }) {
  const result = await pool.query(
    `INSERT INTO users (google_id, email, username, avatar_url)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [googleId, email, username, avatarUrl]
  );
  return result.rows[0];
}

/**
 * 유저 업데이트 (레벨, 점수 등)
 */
export async function updateUser(id, updates) {
  const fields = [];
  const values = [];
  let paramCount = 1;

  for (const [key, value] of Object.entries(updates)) {
    fields.push(`${key} = $${paramCount}`);
    values.push(value);
    paramCount++;
  }

  values.push(id);
  
  const result = await pool.query(
    `UPDATE users 
     SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
     WHERE id = $${paramCount}
     RETURNING *`,
    values
  );
  
  return result.rows[0];
}

/**
 * 유저 통계 업데이트 (게임 플레이 후)
 */
export async function updateUserStats(userId, score) {
  const result = await pool.query(
    `UPDATE users
     SET total_score = total_score + $1,
         games_played = games_played + 1,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING *`,
    [score, userId]
  );
  return result.rows[0];
}

export { pool };
