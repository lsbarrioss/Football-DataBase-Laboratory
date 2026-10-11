const express = require('express');
const { getRecordCounts } = require('../services/recordCount.service');

const router = express.Router();

router.get('/', async (_req, res) => {
    try {
        res.json(await getRecordCounts());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;