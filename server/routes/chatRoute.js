const express = require('express');
const router = express.Router();
const { getAIResponse } = require('../services/textChatService');
const ChatSession = require('../models/Chat');
const { protect } = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');
const { analyzeMedicalImage } = require('../services/imageAnalysisService');

// Multer setup for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Only images are allowed (jpeg, jpg, png, webp)"));
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// @route   POST /api/chat/message
// @desc    Send a message and get AI response, saving to a session
router.post('/message', protect, upload.single('image'), async (req, res) => {
    try {
        const { message, sessionId, initialContext } = req.body;
        const imagePath = req.file ? req.file.path : null;
        
        let chatSession;
        if (sessionId) {
            chatSession = await ChatSession.findOne({ _id: sessionId, user: req.user.id });
        }

        if (!chatSession) {
            chatSession = new ChatSession({
                user: req.user.id,
                title: message ? (message.substring(0, 30) + (message.length > 30 ? '...' : '')) : 'New Consultation',
                messages: []
            });
            
            // If there's initial context (like symptom analyzer results), add it as a system-like message
            if (initialContext) {
                chatSession.messages.push({ 
                    role: 'assistant', 
                    content: `I have reviewed your previous symptom analysis: ${initialContext}. How can I further assist you today?` 
                });
            }
        }

        // Format history for the AI service
        const history = chatSession.messages.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : msg.role,
            content: msg.content
        }));

        let aiResponse = '';
        if (imagePath) {
            // If there's an image, use the vision service
            aiResponse = await analyzeMedicalImage(imagePath, message);
            
            // Add user message with image and AI response
            chatSession.messages.push({ 
                role: 'user', 
                content: message || "Analyzed this image.",
                imageUrl: `/uploads/${path.basename(imagePath)}`
            });
            chatSession.messages.push({ role: 'assistant', content: aiResponse });
        } else if (message) {
            aiResponse = await getAIResponse(message, history);
            // Update chat session with user message and AI response
            chatSession.messages.push({ role: 'user', content: message });
            chatSession.messages.push({ role: 'assistant', content: aiResponse });
        } else if (initialContext && chatSession.messages.length > 0) {
            // If we just added the initial context assistant message
            aiResponse = chatSession.messages[chatSession.messages.length - 1].content;
        }

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
// @desc    Get all chat sessions for user
router.get('/sessions', protect, async (req, res) => {
    try {
        const sessions = await ChatSession.find({ user: req.user.id }).sort({ updatedAt: -1 }).select('title createdAt updatedAt');
        res.json(sessions);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch sessions" });
    }
});

// @route   GET /api/chat/sessions/:sessionId
// @desc    Get a specific chat session's messages
router.get('/sessions/:sessionId', protect, async (req, res) => {
    try {
        const session = await ChatSession.findOne({ _id: req.params.sessionId, user: req.user.id });
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
router.delete('/sessions/:sessionId', protect, async (req, res) => {
    try {
        const result = await ChatSession.findOneAndDelete({ _id: req.params.sessionId, user: req.user.id });
        if (!result) {
            return res.status(404).json({ error: "Session not found" });
        }
        res.json({ success: true, message: "Session deleted" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete session" });
    }
});

module.exports = router;