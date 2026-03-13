const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    doctorName: {
        type: String,
        required: true
    },
    specialization: String,
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
