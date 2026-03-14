const express = require('express');
const router = express.Router();
const { analyzeSymptoms, generateInterviewQuestions } = require('../services/symptomService');
const { protect } = require('../middlewares/authMiddleware');

// @route   POST /api/symptom-analysing/questions
// @desc    Generate follow-up questions for the interview mode
router.post('/questions', protect, async (req, res) => {
    try {
        const { symptoms } = req.body;
        if (!symptoms) {
            return res.status(400).json({ error: "No symptoms provided." });
        }
        
        const data = await generateInterviewQuestions(symptoms);
        res.json({ success: true, questions: data.questions });
    } catch (err) {
        console.error("Questions API Error:", err);
        res.status(500).json({ error: "Failed to generate follow-up questions." });
    }
});

// @route   POST /api/symptom-analysing
// @desc    Analyze symptoms using Gemini AI with Master Medical Prompt
router.post('/', protect, async (req, res) => {
    try {
        const { symptoms, interviewAnswers } = req.body;

        if (!symptoms) {
            return res.status(400).json({ error: "No symptoms provided. Please describe how you feel." });
        }

        let fullDescription = symptoms;
        
        if (interviewAnswers && interviewAnswers.length > 0) {
            const formattedAnswers = interviewAnswers.map(a => `Q: ${a.question}\nA: ${a.answer}`).join("\n\n");
            fullDescription += "\n\n--- CLINICAL FOLLOW-UP ANSWERS ---\n" + formattedAnswers;
        }

        const analysis = await analyzeSymptoms(fullDescription);

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
