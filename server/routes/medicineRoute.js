const express = require('express');
const router = express.Router();
const { searchMedicinePrices } = require('../services/medPriceService');

// @route   GET /api/medicines/search?q=paracetamol
// @desc    Search medicine prices across different pharmacies (Scraping)
router.get('/search', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ error: "Medicine name is required. Use ?q=name" });
        }

        const results = await searchMedicinePrices(query);
        res.json(results);
    } catch (err) {
        console.error("Medicine Price Search Error:", err);
        res.status(500).json({ error: "Failed to fetch prices. External websites might be under high load." });
    }
});

module.exports = router;
