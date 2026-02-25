/**
 * 게임 점수 DB 관련 함수
 */

import { pool } from './users.js';

/**
 * 점수 저장
 */
export async function saveScore({ userId, gameId, score, playerName }) {
  const result = await pool.query(
    `INSERT INTO game_scores (user_id, game_id, score, player_name)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [userId || null, gameId, score, playerName || '게스트']
  );
  return result.rows[0];
}

/**
 * 게임별 상위 랭킹 조회
 */
export async function getRankings(gameId, limit = 10) {
  const result = await pool.query(
    `SELECT
       gs.id,
       gs.score,
       gs.player_name,
       gs.played_at,
       u.username,
       u.avatar_url,
       u.tier,
       RANK() OVER (ORDER BY gs.score DESC) AS rank
     FROM game_scores gs
     LEFT JOIN users u ON gs.user_id = u.id
     WHERE gs.game_id = $1
     ORDER BY gs.score DESC
     LIMIT $2`,
    [gameId, limit]
  );
  return result.rows;
}

/**
 * 특정 유저의 최고 점수
 */
export async function getUserBestScore(userId, gameId) {
  const result = await pool.query(
    `SELECT MAX(score) as best_score FROM game_scores
     WHERE user_id = $1 AND game_id = $2`,
    [userId, gameId]
  );
  return result.rows[0]?.best_score || 0;
}

/**
 * 특정 유저의 게임 랭킹 순위
 */
export async function getUserRank(userId, gameId) {
  const result = await pool.query(
    `SELECT COUNT(*) + 1 AS rank
     FROM game_scores gs
     INNER JOIN (
       SELECT MAX(score) as best FROM game_scores WHERE user_id = $1 AND game_id = $2
     ) my ON gs.score > my.best
     WHERE gs.game_id = $2`,
    [userId, gameId]
  );
  return parseInt(result.rows[0]?.rank || 0);
}
