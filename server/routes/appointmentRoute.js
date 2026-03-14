const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { protect } = require('../middlewares/authMiddleware');

// @route   POST /api/appointments
// @desc    Book a new appointment
router.post('/', protect, async (req, res) => {
    try {
        const { doctorName, specialization, date, time } = req.body;
        const newAppointment = new Appointment({
            user: req.user.id,
            doctorName,
            specialization,
            date,
            time
        });
        await newAppointment.save();
        res.json({ success: true, appointment: newAppointment });
    } catch (err) {
        res.status(500).json({ error: "Booking failed" });
    }
});

// @route   GET /api/appointments
// @desc    Get user's appointments
router.get('/', protect, async (req, res) => {
    try {
        const appointments = await Appointment.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch appointments" });
    }
});

module.exports = router;
