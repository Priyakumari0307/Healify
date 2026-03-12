const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./configs/db');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const symptomRoutes = require('./routes/symptomRoute');
const chatRoutes = require('./routes/chatRoute');
const medicineRoutes = require('./routes/medicineRoute');

// Initialize Express
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/prescription', prescriptionRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/symptom-analysing', symptomRoutes);
app.use('/api/medicines', medicineRoutes);

app.get('/', (req, res) => {
    res.send('server is running');
});

// Port configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
