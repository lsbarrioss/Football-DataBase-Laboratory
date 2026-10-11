const insert = async (executor, seasonName) => {
    const [result] = await executor.query(
        'INSERT INTO season (season_name) VALUES (?)',
        [seasonName]
    );
    return result.insertId;
};

module.exports = { insert };