const express = require('express');
const router = express.Router();
const { getAIResponse } = require('../services/textChatService');


router.post('/message', async (req, res) => {
    try {
        const { message, history } = req.body;
        const response = await getAIResponse(message, history || []);

        res.json({
            success: true,
            content: response,
            disclaimer: "This is AI-generated advice. Consult a doctor for medical concerns." // Requirement CB-04
        });
    } catch (err) {
        res.status(500).json({ error: "AI communication failed" });
    }
});


module.exports = router;