const mongoose = require('mongoose');

const PrescriptionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    originalFileName: String,
    ocrData: String,
    analysis: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Prescription', PrescriptionSchema);
