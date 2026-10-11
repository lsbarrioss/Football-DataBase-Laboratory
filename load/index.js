require('dotenv').config({ quiet: true });

const path = require('path');
const db = require('../services/mysql.service');
const { getRecordCounts } = require('../services/recordCount.service');
const { readCsv } = require('./csvReader');
const { parseRow, assertConsistentSeason } = require('./rowValidator');
const { loadMatch } = require('./matchLoader');

const PARTICIPATIONS_PER_MATCH = 2;

const getCsvPath = () => {
    if (!process.env.CSV_PATH) {
        throw new Error('Missing environment variable: CSV_PATH');
    }
    return path.resolve(process.env.CSV_PATH);
};

const assertDatabaseIsEmpty = async () => {
    const counts = await getRecordCounts();
    const totalRecords = Object.values(counts).reduce((sum, total) => sum + total, 0);
    if (totalRecords > 0) {
        throw new Error(
            'The database already contains data. Recreate it with sql/schema.sql before loading again.'
        );
    }
};

const loadAllMatches = async (records) => {
    const seasonByDate = new Map();
    const rejections = [];
    let loadedMatches = 0;

    for (const [index, record] of records.entries()) {
        try {
            const match = parseRow(record);
            assertConsistentSeason(seasonByDate, match);
            await loadMatch(match);
            loadedMatches += 1;
        } catch (error) {
            rejections.push({ rowNumber: index + 1, reason: error.message });
        }
    }

    return { loadedMatches, rejections };
};

const printSummary = ({ loadedMatches, rejections }, counts) => {
    console.log(`Matches loaded: ${loadedMatches}`);
    console.log(`Rows rejected: ${rejections.length}`);
    rejections.forEach(({ rowNumber, reason }) => {
        console.log(`  Data row ${rowNumber}: ${reason}`);
    });
    console.table(counts);
    const hasTwoPerMatch = counts.participation === counts.football_match * PARTICIPATIONS_PER_MATCH;
    console.log(`Two participations per match: ${hasTwoPerMatch ? 'yes' : 'NO'}`);
};

const main = async () => {
    try {
        await assertDatabaseIsEmpty();
        const records = readCsv(getCsvPath());
        const result = await loadAllMatches(records);
        printSummary(result, await getRecordCounts());
        process.exitCode = result.rejections.length > 0 ? 1 : 0;
    } catch (error) {
        console.error(`Load failed: ${error.message}`);
        process.exitCode = 1;
    } finally {
        await db.end();
    }
};

main();