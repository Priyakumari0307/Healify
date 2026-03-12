const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { getAIResponse } = require('../services/textChatService');
const { speechToText, textToSpeech } = require('../services/voiceService');

const upload = multer({ dest: 'uploads/' });

router.post('/voice-message', upload.single('audio'), async (req, res) => {
    try {
        const audioFile = req.file;
        const history = req.body.history ? JSON.parse(req.body.history) : [];

        if (!audioFile) {
            return res.status(400).json({ error: "No audio file provided" });
        }

        // Step 1: Voice Input -> Text (STT)
        console.log("--- Step 1: Sarvam STT ---");
        const userText = await speechToText(audioFile.path);
        console.log("User said:", userText);

        // Check for empty transcript as per snippet logic
        if (!userText || userText.trim() === "") {
            fs.unlinkSync(audioFile.path); // Clean up
            return res.json({
                success: true,
                user_text: "Could not understand audio",
                ai_text: "I couldn't hear you clearly.",
                audio: null
            });
        }

        // Step 2: Text -> AI Logic (AI Response with Doctor Persona)
        console.log("--- Step 2: AI Logic (Doctor) ---");
        const aiResponseText = await getAIResponse(userText, history);
        console.log("AI response:", aiResponseText);

        // Step 3: AI Text -> Voice Output (TTS Ritu)
        console.log("--- Step 3: Sarvam TTS (Ritu) ---");
        const base64Audio = await textToSpeech(aiResponseText);

        // Clean up the uploaded file
        fs.unlinkSync(audioFile.path);

        res.json({
            success: true,
            user_text: userText,
            ai_text: aiResponseText,
            audio: base64Audio,
            disclaimer: "This is AI-generated advice. Consult a doctor for medical concerns."
        });

    } catch (err) {
        console.error("Voice pipeline error:", err);
        // Ensure file is cleaned up even on error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: "Voice interaction failed", details: err.message });
    }
});

module.exports = router;
