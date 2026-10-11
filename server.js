require('dotenv').config({ quiet: true });

const express = require('express');
const recordCountRoutes = require('./routes/recordCount.routes');
const basicQueryRoutes = require('./routes/basicQuery.routes');
const analysisQueryRoutes = require('./routes/analysisQuery.routes');

const DEFAULT_PORT = 5000;
const JSON_INDENTATION = 2;
const PORT = process.env.PORT || DEFAULT_PORT;
const api = express();

api.set('json spaces', JSON_INDENTATION);
api.use('/record-counts', recordCountRoutes);
api.use('/basic-queries', basicQueryRoutes);
api.use('/analysis-queries', analysisQueryRoutes);

api.listen(PORT, () => {
    console.log(`Server running in http://localhost:${PORT}`);
});