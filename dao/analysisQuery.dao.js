
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


const WIN_POINTS = 3;
const DRAW_POINTS = 1;
const LOW_POSSESSION_THRESHOLD = 50;
const PERCENTAGE_SCALE = 100;
const DECIMAL_PLACES = 2;

const listAllTimePointsTable = async () => {
    const [rows] = await db.query(
        `WITH team_results AS (
           SELECT t.team_name,
                  COUNT(p.match_id) AS matches_played,
                  SUM(p.goals > opponent.goals) AS wins,
                  SUM(p.goals = opponent.goals) AS draws,
                  SUM(p.goals < opponent.goals) AS losses
           FROM participation p
           JOIN team t ON t.team_id = p.team_id
           JOIN participation opponent
             ON opponent.match_id = p.match_id
            AND opponent.team_id <> p.team_id
           GROUP BY t.team_id, t.team_name
         )
         SELECT team_name, matches_played, wins, draws, losses,
                wins * ? + draws * ? AS total_points,
                ROUND(
                    (wins * ? + draws * ?) / matches_played,
                    ?
                ) AS points_per_match
         FROM team_results
         ORDER BY total_points DESC, points_per_match DESC, team_name`,
        [WIN_POINTS, DRAW_POINTS, WIN_POINTS, DRAW_POINTS, DECIMAL_PLACES]
    );
    return rows;
};

const listWinningPossessionSummary = async () => {
    const [rows] = await db.query(
        `WITH winning_performances AS (
           SELECT p.team_id, p.possession_pct
           FROM participation p
           JOIN participation opponent
             ON opponent.match_id = p.match_id
            AND opponent.team_id <> p.team_id
           WHERE p.goals > opponent.goals
         ), team_summary AS (
           SELECT team_id,
                  COUNT(team_id) AS wins,
                  AVG(possession_pct) AS average_winning_possession,
                  SUM(possession_pct < ?) AS low_possession_wins
           FROM winning_performances
           GROUP BY team_id
         ), dataset_summary AS (
           SELECT SUM(wins) AS dataset_wins,
                  SUM(low_possession_wins) AS dataset_low_possession_wins
           FROM team_summary
         )
         SELECT t.team_name, w.wins,
                ROUND(
                    w.average_winning_possession,
                    ?
                ) AS average_winning_possession,
                w.low_possession_wins,
                ROUND(
                    w.low_possession_wins * ? / w.wins,
                    ?
                ) AS low_possession_win_percentage,
                d.dataset_wins,
                d.dataset_low_possession_wins,
                ROUND(
                    d.dataset_low_possession_wins * ? / d.dataset_wins,
                    ?
                ) AS dataset_low_possession_win_percentage
         FROM team_summary w
         JOIN team t ON t.team_id = w.team_id
         CROSS JOIN dataset_summary d
         ORDER BY w.average_winning_possession DESC, w.wins DESC, t.team_name`,
        [
            LOW_POSSESSION_THRESHOLD,
            DECIMAL_PLACES,
            PERCENTAGE_SCALE,
            DECIMAL_PLACES,
            PERCENTAGE_SCALE,
            DECIMAL_PLACES
        ]
    );
    return rows;
};

module.exports = {
    listHighestShotsToGoalsDifference,
    listRedCardsAndGoalsBySeason,
    listAllTimePointsTable,
    listWinningPossessionSummary
};

