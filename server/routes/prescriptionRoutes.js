const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { analyzeWithGroq } = require('../services/groqService');
const { normalizeData, applySafetyChecks, generateMedTimeline } = require('../utils/prescriptionUtils');
const { protect } = require('../middlewares/authMiddleware');
const Prescription = require('../models/Prescription');

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const fileExt = path.extname(file.originalname);
        cb(null, `${uuidv4()}${fileExt}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPEG/PNG images are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// @route   POST /api/prescription
// @desc    Upload and analyze a prescription image
router.post('/', protect, upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const savePath = req.file.path;
    const engine = req.query.engine || 'groq';

    try {
        console.log(`Processing with ${engine} engine...`);

        // 1. OCR + Extraction (Defaulting to Groq for now)
        let rawResult;
        if (engine === 'groq') {
            rawResult = await analyzeWithGroq(savePath);
        } else {
            // Fallback or placeholder for other engines
            if (fs.existsSync(savePath)) fs.unlinkSync(savePath);
            return res.status(400).json({ error: 'Unsupported engine' });
        }

        // 2. Normalization
        let result = normalizeData(rawResult);

        // 3. Safety Engine (Dosage & Interaction)
        result = applySafetyChecks(result);

        // 4. Generate Medication Schedule
        result.medication_timeline = generateMedTimeline(result.medications || []);

        // 5. AI Patient Summary
        const patientName = result.patient_details?.name || 'Patient';
        result.patient_friendly_summary = `A summary for ${patientName} regarding their prescription for ${(result.medications || []).length} medications.`;

        // 6. Fraud Suspicion (Basic Heuristic)
        result.fraud_suspicion_flag = (result.medications || []).length > 10;

        // 7. Save to Database
        const newHistory = new Prescription({
            user: req.user.id,
            originalFileName: req.file.originalname,
            ocrData: JSON.stringify(rawResult),
            analysis: JSON.stringify(result)
        });
        await newHistory.save();

        // 8. Cleanup
        if (fs.existsSync(savePath)) fs.unlinkSync(savePath);

        res.json(result);

    } catch (error) {
        console.error('Prescription Analysis Error:', error);

        // Cleanup on error
        if (fs.existsSync(savePath)) {
            fs.unlinkSync(savePath);
        }

        res.status(500).json({
            error: 'Analysis failed',
            details: error.message
        });
    }
});

// @route   GET /api/prescription/history
// @desc    Get user's prescription history
router.get('/history', protect, async (req, res) => {
    try {
        const history = await Prescription.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch prescription history" });
    }
});

module.exports = router;
