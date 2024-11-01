const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create an Express app
const app = express();

// Apply middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', require('./routes/patientRoutes')); // Use the patient routes under "/api"
app.use('/api', require('./routes/doctorRoutes')); // Use the doctor routes under "/api"
app.use('/api', require('./routes/appointmentRoutes')); // Use the appointment routes under "/api"
app.use('/api', require('./routes/paymentRoutes')); // Use the payment routes under "/api"
app.use('/api', require('./routes/employeeRoutes')); // Use the employee routes under "/api"
app.use('/api', require('./routes/leaveRoutes')); // Use the leave routes under "/api"
app.use('/api', require('./routes/prescriptionRoutes')); // Use the prescription routes under "/api"

// Only start the server when not in a test environment
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export the app for testing
module.exports = app;
