// patientController.js
const patientService = require('../services/patientService');
const bcrypt = require('bcryptjs');

class PatientController {
    async getAllPatients(req, res) {
        try {
            const patients = await patientService.getAllPatients();
            res.json(patients);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async getPatientById(req, res) {
        try {
            const patient = await patientService.getPatientById(req.params.patient_id);
            if (patient) {
                res.json(patient);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async createPatient(req, res) {
        try {
            console.log('Request Body:', req.body);  // Log incoming request body
            const patientId = await patientService.createPatient(req.body);
            res.status(201).json({ id: patientId });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async updatePatient(req, res) {
        try {
            console.log('Request Body:', req.body);  // Log incoming request body
            await patientService.updatePatient(req.params.patient_id, req.body);
            res.status(200).json({ message: 'User updated successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async deletePatient(req, res) {
        try {
            await patientService.deletePatient(req.params.patient_id);
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Patient login
    async login(req, res) {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
        }

        try {
        // Find patient by email
        const patient = await patientService.getPatientByEmail(email);
        if (!patient) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Compare the password
        const isPasswordValid = await bcrypt.compare(password, patient.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // If valid, return patient data
        res.status(200).json({ message: 'Login successful', patient });
        } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
}

module.exports = new PatientController();
