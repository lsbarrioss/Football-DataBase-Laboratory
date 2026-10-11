const express = require('express');

const createQueryRouter = (queries) => {
    const router = express.Router();

    Object.entries(queries).forEach(([name, run]) => {
        router.get(`/${name}`, async (_req, res) => {
            try {
                res.json(await run());
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    });

    return router;
};

module.exports = { createQueryRouter };