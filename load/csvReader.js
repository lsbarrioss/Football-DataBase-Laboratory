const fs = require('fs');
const { parse } = require('csv-parse/sync');
const { REQUIRED_COLUMNS } = require('./csvColumns');

const assertRequiredColumns = (availableColumns) => {
    const missingColumns = REQUIRED_COLUMNS.filter(
        (column) => !availableColumns.includes(column)
    );
    if (missingColumns.length > 0) {
        throw new Error(`The CSV file is missing columns: ${missingColumns.join(', ')}`);
    }
};

const parseContent = (content) => {
    try {
        return parse(content, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
            bom: true
        });
    } catch (error) {
        throw new Error(
            `The CSV file could not be read. Check that it uses commas as separators (${error.message})`
        );
    }
};

const readCsv = (filePath) => {
    const content = fs.readFileSync(filePath, 'utf8');
    const records = parseContent(content);
    if (records.length === 0) {
        throw new Error('The CSV file has no data rows');
    }
    assertRequiredColumns(Object.keys(records[0]));
    return records;
};

module.exports = { readCsv };