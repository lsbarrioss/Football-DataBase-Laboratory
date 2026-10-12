
const db = require('../services/mysql.service');

const LIMIT_ONE = 1;

const listHighestShotsToGoalsDifference = async () => {
  const [rows] = await db.query(
    `SELECT 
      s.season_name,
      t.team_name,
      SUM(p.shots_on_target) AS total_shots_on_target,
      SUM(p.goals) AS total_goals,
      (SUM(p.shots_on_target) - SUM(p.goals)) AS shots_goals_difference
    FROM participation p
    JOIN team t ON p.team_id = t.team_id
    JOIN football_match m ON p.match_id = m.match_id
    JOIN season s ON m.season_id = s.season_id
    GROUP BY s.season_id, s.season_name, t.team_id, t.team_name
    ORDER BY shots_goals_difference DESC
    LIMIT ?`,
    [LIMIT_ONE]
  );
  return rows;
};

const listRedCardsAndGoalsBySeason = async () => {
  const [rows] = await db.query(
    `SELECT 
      s.season_name,
      SUM(p.red_cards) AS total_red_cards,
      SUM(p.goals) AS total_goals
    FROM participation p
    JOIN football_match m ON p.match_id = m.match_id
    JOIN season s ON m.season_id = s.season_id
    GROUP BY s.season_id, s.season_name
    ORDER BY total_red_cards DESC`
  );
  return rows;
};

module.exports = {
  listHighestShotsToGoalsDifference,
  listRedCardsAndGoalsBySeason
};

