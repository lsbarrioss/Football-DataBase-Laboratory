const SEASON_COLUMN = 'season';
const DATE_COLUMN = 'date';

const HOME_COLUMNS = {
    team: 'home_team',
    goals: 'goal_home_ft',
    possession: 'home_possession',
    shotsOnTarget: 'home_shots_on_target',
    redCards: 'home_red_cards'
};

const AWAY_COLUMNS = {
    team: 'away_team',
    goals: 'goal_away_ft',
    possession: 'away_possession',
    shotsOnTarget: 'away_shots_on_target',
    redCards: 'away_red_cards'
};

const REQUIRED_COLUMNS = [
    SEASON_COLUMN,
    DATE_COLUMN,
    ...Object.values(HOME_COLUMNS),
    ...Object.values(AWAY_COLUMNS)
];

module.exports = { SEASON_COLUMN, DATE_COLUMN, HOME_COLUMNS, AWAY_COLUMNS, REQUIRED_COLUMNS };