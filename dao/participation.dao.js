const insert = async (executor, participation) => {
    const { matchId, teamId, side, goals, possessionPct, shotsOnTarget, redCards } = participation;
    await executor.query(
        `INSERT INTO participation
            (match_id, team_id, side, goals, possession_pct, shots_on_target, red_cards)
         VALUES (?, ?, ?, ?, ?, ?, ?)`, //The ? are parameters: MySQL receives the values ​​separately from the statement, which prevents quoting errors.
        [matchId, teamId, side, goals, possessionPct, shotsOnTarget, redCards]
    );
};

module.exports = { insert };