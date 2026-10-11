const { SEASON_COLUMN, DATE_COLUMN, HOME_COLUMNS, AWAY_COLUMNS } = require('./csvColumns');

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const INTEGER_PATTERN = /^\d+$/;
const MAX_SMALL_INTEGER = 255;
const FULL_PERCENTAGE = 100;
const PERCENTAGE_SUM_TOLERANCE = 0.05;

const requireText = (value, columnName) => {
    if (!value) {
        throw new Error(`${columnName} is empty`);
    }
    return value;
};

const parseSmallInteger = (value, columnName) => {
    if (!INTEGER_PATTERN.test(value) || Number(value) > MAX_SMALL_INTEGER) {
        throw new Error(
            `${columnName} must be an integer between 0 and ${MAX_SMALL_INTEGER}, received "${value}"`
        );
    }
    return Number(value);
};

const parsePercentage = (value, columnName) => {
    const percentage = Number(value);
    if (value === '' || Number.isNaN(percentage) || percentage < 0 || percentage > FULL_PERCENTAGE) {
        throw new Error(
            `${columnName} must be a number between 0 and ${FULL_PERCENTAGE}, received "${value}"`
        );
    }
    return percentage;
};

const parseDate = (value, columnName) => {
    const parsedDate = new Date(`${value}T00:00:00Z`);
    const isValidCalendarDate = DATE_PATTERN.test(value)
        && !Number.isNaN(parsedDate.getTime())
        && parsedDate.toISOString().slice(0, 10) === value;
    if (!isValidCalendarDate) {
        throw new Error(`${columnName} must be a valid date in YYYY-MM-DD format, received "${value}"`);
    }
    return value;
};

const parseTeamStats = (rawRow, columns) => ({
    teamName: requireText(rawRow[columns.team], columns.team),
    goals: parseSmallInteger(rawRow[columns.goals], columns.goals),
    possessionPct: parsePercentage(rawRow[columns.possession], columns.possession),
    shotsOnTarget: parseSmallInteger(rawRow[columns.shotsOnTarget], columns.shotsOnTarget),
    redCards: parseSmallInteger(rawRow[columns.redCards], columns.redCards)
});

const assertValidMatch = (match) => {
    if (match.home.teamName === match.away.teamName) {
        throw new Error(`A team cannot play against itself: ${match.home.teamName}`);
    }
    const possessionTotal = match.home.possessionPct + match.away.possessionPct;
    if (Math.abs(possessionTotal - FULL_PERCENTAGE) > PERCENTAGE_SUM_TOLERANCE) {
        throw new Error(`Possession percentages add up to ${possessionTotal}, expected ${FULL_PERCENTAGE}`);
    }
};

const parseRow = (rawRow) => {
    const match = {
        seasonName: requireText(rawRow[SEASON_COLUMN], SEASON_COLUMN),
        matchDate: parseDate(rawRow[DATE_COLUMN], DATE_COLUMN),
        home: parseTeamStats(rawRow, HOME_COLUMNS),
        away: parseTeamStats(rawRow, AWAY_COLUMNS)
    };
    assertValidMatch(match);
    return match;
};

const assertConsistentSeason = (seasonByDate, match) => {
    const knownSeason = seasonByDate.get(match.matchDate);
    if (knownSeason !== undefined && knownSeason !== match.seasonName) {
        throw new Error(
            `Date ${match.matchDate} already belongs to season ${knownSeason}, not ${match.seasonName}`
        );
    }
    seasonByDate.set(match.matchDate, match.seasonName);
};

module.exports = { parseRow, assertConsistentSeason };