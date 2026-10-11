const insert = async (executor, teamName) => {
    const [result] = await executor.query(
        'INSERT INTO team (team_name) VALUES (?)',
        [teamName]
    );
    return result.insertId;
};

module.exports = { insert };