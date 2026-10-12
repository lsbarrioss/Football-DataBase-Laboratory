const { createQueryRouter } = require('./createQueryRouter');
const analysisQueryDao = require('../dao/analysisQuery.dao');

module.exports = createQueryRouter({
    'highest-shots-to-goals-difference': analysisQueryDao.listHighestShotsToGoalsDifference,
    'red-cards-and-goals-by-season': analysisQueryDao.listRedCardsAndGoalsBySeason,
    'all-time-points-table': analysisQueryDao.listAllTimePointsTable,
    'winning-possession-summary': analysisQueryDao.listWinningPossessionSummary
});