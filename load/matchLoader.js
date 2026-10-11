const db = require('../services/mysql.service');
const teamDao = require('../dao/team.dao');
const seasonDao = require('../dao/season.dao');
const matchDao = require('../dao/match.dao');
const participationDao = require('../dao/participation.dao');

const SIDE_HOME = 'HOME';
const SIDE_AWAY = 'AWAY';

const teamIds = new Map();
const seasonIds = new Map();

const getOrCreateId = async (cache, name, insertFunction) => {
    if (!cache.has(name)) {
        cache.set(name, await insertFunction(db, name));
    }
    return cache.get(name);
};

const resolveCatalogIds = async (match) => ({
    seasonId: await getOrCreateId(seasonIds, match.seasonName, seasonDao.insert),
    homeTeamId: await getOrCreateId(teamIds, match.home.teamName, teamDao.insert),
    awayTeamId: await getOrCreateId(teamIds, match.away.teamName, teamDao.insert)
});

const saveMatchWithParticipations = async (match, ids) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const matchId = await matchDao.insert(connection, match.matchDate, ids.seasonId);
        await participationDao.insert(connection, {
            ...match.home, matchId, teamId: ids.homeTeamId, side: SIDE_HOME
        });
        await participationDao.insert(connection, {
            ...match.away, matchId, teamId: ids.awayTeamId, side: SIDE_AWAY
        });
        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

const loadMatch = async (match) => {
    const ids = await resolveCatalogIds(match);
    await saveMatchWithParticipations(match, ids);
};

module.exports = { loadMatch };