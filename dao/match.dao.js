const insert = async (executor, matchDate, seasonId) => {
    const [result] = await executor.query(
        'INSERT INTO football_match (match_date, season_id) VALUES (?, ?)',
        [matchDate, seasonId]
    );
    return result.insertId;
};

module.exports = { insert };