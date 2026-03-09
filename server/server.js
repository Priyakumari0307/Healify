const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./configs/db');

// Initialize Express
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/prescription', require('./routes/prescriptionRoutes'));

app.get('/', (req, res) => {
    res.send('server is running');
});

// Port configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
