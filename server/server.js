const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./configs/db');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const symptomRoutes = require('./routes/symptomRoute');
const chatRoutes = require('./routes/chatRoute');
const voiceRoutes = require('./routes/voiceRoute');
const medicineRoutes = require('./routes/medicineRoute');
const appointmentRoutes = require('./routes/appointmentRoute');
const authRoutes = require('./routes/authRoute');

// Initialize Express
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/prescription', prescriptionRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/symptom-analysing', symptomRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('server is running');
});

// Port configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
