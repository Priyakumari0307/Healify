const express = require('express');
const router = express.Router();
const { getAIResponse } = require('../services/textChatService');
const ChatSession = require('../models/Chat');

// @route   POST /api/chat/message
// @desc    Send a message and get AI response, saving to a session
router.post('/message', async (req, res) => {
    try {
        const { message, sessionId } = req.body;
        
        let chatSession;
        if (sessionId) {
            chatSession = await ChatSession.findById(sessionId);
        }

        if (!chatSession) {
            chatSession = new ChatSession({
                title: message.substring(0, 30) + (message.length > 30 ? '...' : ''),
                messages: []
            });
        }

        // Format history for the AI service
        const history = chatSession.messages.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : msg.role,
            content: msg.content
        }));

        const aiResponse = await getAIResponse(message, history);

        // Update chat session
        chatSession.messages.push({ role: 'user', content: message });
        chatSession.messages.push({ role: 'assistant', content: aiResponse });
        chatSession.updatedAt = Date.now();
        
        await chatSession.save();

        res.json({
            success: true,
            sessionId: chatSession._id,
            content: aiResponse,
            messages: chatSession.messages,
            disclaimer: "This is AI-generated advice. Consult a doctor for medical concerns."
        });
    } catch (err) {
        console.error("Chat Router Error:", err);
        res.status(500).json({ error: "AI communication failed" });
    }
});

// @route   GET /api/chat/sessions
// @desc    Get all chat sessions
router.get('/sessions', async (req, res) => {
    try {
        const sessions = await ChatSession.find().sort({ updatedAt: -1 }).select('title createdAt updatedAt');
        res.json(sessions);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch sessions" });
    }
});

// @route   GET /api/chat/sessions/:sessionId
// @desc    Get a specific chat session's messages
router.get('/sessions/:sessionId', async (req, res) => {
    try {
        const session = await ChatSession.findById(req.params.sessionId);
        if (!session) {
            return res.status(404).json({ error: "Session not found" });
        }
        res.json(session);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch session" });
    }
});

// @route   DELETE /api/chat/sessions/:sessionId
// @desc    Delete a chat session
router.delete('/sessions/:sessionId', async (req, res) => {
    try {
        await ChatSession.findByIdAndDelete(req.params.sessionId);
        res.json({ success: true, message: "Session deleted" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete session" });
    }
});

module.exports = router;