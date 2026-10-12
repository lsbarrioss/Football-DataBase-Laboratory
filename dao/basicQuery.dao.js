const db = require('../services/mysql.service');

const MIN_AWAY_GOALS = 4;
const MAX_LOW_POSSESSION_PCT = 40;
const MIN_HIGH_SCORING_GOALS = 7;

const listAwayScoringWithLowPossession = async () => {
    const [rows] = await db.query(
        `SELECT match_id, team_id, goals, possession_pct, shots_on_target
         FROM participation
         WHERE side = 'AWAY' AND goals >= ? AND possession_pct < ?
         ORDER BY goals DESC, possession_pct ASC, match_id`,
        [MIN_AWAY_GOALS, MAX_LOW_POSSESSION_PCT]
    );
    return rows;
};

const listHighScoringPerformances = async () => {
    const [rows] = await db.query(
        `SELECT t.team_name, p.goals, p.match_id
         FROM participation p
         JOIN team t ON t.team_id = p.team_id
         WHERE p.goals >= ?
         ORDER BY p.goals DESC, t.team_name, p.match_id`,
        [MIN_HIGH_SCORING_GOALS]
    );
    return rows;
};


const HOME_SIDE = 'HOME';
const AWAY_SIDE = 'AWAY';
const NO_GOALS = 0;
const DECIMAL_PLACES = 2;

const listHomeCleanSheetWins = async () => {
    const [rows] = await db.query(
        `SELECT m.match_id, m.match_date, s.season_name,
                home_team.team_name AS home_team,
                away_team.team_name AS away_team,
                home.goals AS home_goals,
                away.goals AS away_goals
         FROM football_match m
         JOIN season s ON s.season_id = m.season_id
         JOIN participation home
           ON home.match_id = m.match_id AND home.side = ?
         JOIN team home_team ON home_team.team_id = home.team_id
         JOIN participation away
           ON away.match_id = m.match_id AND away.side = ?
         JOIN team away_team ON away_team.team_id = away.team_id
         WHERE home.goals > ? AND away.goals = ?
         ORDER BY m.match_date DESC, m.match_id DESC`,
        [HOME_SIDE, AWAY_SIDE, NO_GOALS, NO_GOALS]
    );
    return rows;
};

const listTeamGoalsBySide = async () => {
    const [rows] = await db.query(
        `SELECT t.team_name, p.side,
                COUNT(p.match_id) AS matches_played,
                SUM(p.goals) AS total_goals,
                ROUND(AVG(p.goals), ?) AS average_goals
         FROM participation p
         JOIN team t ON t.team_id = p.team_id
         GROUP BY t.team_id, t.team_name, p.side
         ORDER BY average_goals DESC, total_goals DESC, t.team_name, p.side`,
        [DECIMAL_PLACES]
    );
    return rows;
};

module.exports = {
    listAwayScoringWithLowPossession,
    listHighScoringPerformances,
    listHomeCleanSheetWins,
    listTeamGoalsBySide
};

