const db = require('./mysql.service');

const TABLE_NAMES = ['team', 'season', 'football_match', 'participation'];

const countRows = async (tableName) => {
    const [rows] = await db.query('SELECT COUNT(*) AS total FROM ??', [tableName]);
    return rows[0].total;
};

const getRecordCounts = async () => {
    const counts = {};
    for (const tableName of TABLE_NAMES) {
        counts[tableName] = await countRows(tableName);
    }
    return counts;
};

module.exports = { getRecordCounts };