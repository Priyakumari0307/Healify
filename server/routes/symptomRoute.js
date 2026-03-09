const express = require('express');
const router = express.Router();
const { analyzeSymptoms } = require('../services/symptomService');

// @route   POST /api/symptom-analysing
// @desc    Analyze symptoms using Gemini AI with Master Medical Prompt
router.post('/', async (req, res) => {
    try {
        const { symptoms } = req.body;

        if (!symptoms) {
            return res.status(400).json({ error: "No symptoms provided. Please describe how you feel." });
        }

        const analysis = await analyzeSymptoms(symptoms);

        res.json({
            success: true,
            analysis: analysis,
            disclaimer: "This is AI triage. If you feel this is an emergency, seek immediate medical care."
        });
    } catch (err) {
        console.error("Symptom Analysis API Error:", err);
        res.status(500).json({ error: "Symptom analysis failed. Please try again later." });
    }
});

module.exports = router;
