const express = require('express');
const router = express.Router();
const PrescriptionController = require('../controllers/PrescriptionController');

// Get all prescriptions
router.get('/prescriptions', PrescriptionController.getAllPrescriptions);

// Get a prescription by ID
router.get('/prescriptions/:id', PrescriptionController.getPrescriptionById);

// Create a new prescription
router.post('/prescriptions', PrescriptionController.createPrescription);

// Update a prescription by ID
router.put('/prescriptions/:id', PrescriptionController.updatePrescription);

// Delete a prescription by ID
router.delete('/prescriptions/:id', PrescriptionController.deletePrescription);

// Route to get prescriptions by patient ID
router.get('/prescriptionByPatient', PrescriptionController.getPrescriptionsByPatient);

module.exports = router;
