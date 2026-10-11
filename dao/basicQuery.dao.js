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

module.exports = {
    listAwayScoringWithLowPossession,
    listHighScoringPerformances
};