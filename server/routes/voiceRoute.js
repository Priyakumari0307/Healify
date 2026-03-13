const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { getAIResponse } = require('../services/textChatService');
const { speechToText, textToSpeech } = require('../services/voiceService');
const ChatSession = require('../models/Chat');

const upload = multer({ dest: 'uploads/' });

router.post('/voice-message', upload.single('audio'), async (req, res) => {
    try {
        const audioFile = req.file;
        const { sessionId } = req.body;

        if (!audioFile) {
            return res.status(400).json({ error: "No audio file provided" });
        }

        // Step 1: Voice Input -> Text (STT)
        console.log("--- Step 1: Sarvam STT ---");
        const userText = await speechToText(audioFile.path);
        console.log("User said:", userText);

        // Check for empty transcript
        if (!userText || userText.trim() === "") {
            fs.unlinkSync(audioFile.path); // Clean up
            return res.json({
                success: true,
                user_text: "Could not understand audio",
                ai_text: "I couldn't hear you clearly. Please try again.",
                audio: null
            });
        }

        // Handle Chat Session Database
        let chatSession;
        if (sessionId) {
            chatSession = await ChatSession.findById(sessionId);
        }

        if (!chatSession) {
            chatSession = new ChatSession({
                title: userText.substring(0, 30) + (userText.length > 30 ? '...' : ''),
                messages: []
            });
        }

        // Format history for the AI service
        const history = chatSession.messages.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : msg.role,
            content: msg.content
        }));

        // Step 2: Text -> AI Logic (AI Response with Doctor Persona)
        console.log("--- Step 2: AI Logic (Doctor) ---");
        const aiResponseText = await getAIResponse(userText, history);
        console.log("AI response:", aiResponseText);

        // Update chat session
        chatSession.messages.push({ role: 'user', content: userText });
        chatSession.messages.push({ role: 'assistant', content: aiResponseText });
        chatSession.updatedAt = Date.now();
        await chatSession.save();

        // Step 3: AI Text -> Voice Output (TTS Ritu)
        console.log("--- Step 3: Sarvam TTS (Ritu) ---");
        const base64Audio = await textToSpeech(aiResponseText);

        // Clean up the uploaded file
        fs.unlinkSync(audioFile.path);

        res.json({
            success: true,
            sessionId: chatSession._id,
            user_text: userText,
            ai_text: aiResponseText,
            audio: base64Audio,
            messages: chatSession.messages,
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
