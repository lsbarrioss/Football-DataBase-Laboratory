const { createQueryRouter } = require('./createQueryRouter');
const basicQueryDao = require('../dao/basicQuery.dao');

module.exports = createQueryRouter({
    'away-scoring-low-possession': basicQueryDao.listAwayScoringWithLowPossession,
    'high-scoring-performances': basicQueryDao.listHighScoringPerformances,
    'home-clean-sheet-wins': basicQueryDao.listHomeCleanSheetWins,
    'team-goals-by-side': basicQueryDao.listTeamGoalsBySide
});