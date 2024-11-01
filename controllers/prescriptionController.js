const PrescriptionService = require('../services/prescriptionService');

class PrescriptionController {
    // Get all prescriptions
    async getAllPrescriptions(req, res) {
        try {
            const prescriptions = await PrescriptionService.getAllPrescriptions();
            res.status(200).json(prescriptions);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get prescription by ID
    async getPrescriptionById(req, res) {
        try {
            const { id } = req.params;
            const prescription = await PrescriptionService.getPrescriptionById(id);
            if (!prescription) {
                return res.status(404).json({ message: 'Prescription not found' });
            }
            res.status(200).json(prescription);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Create a new prescription
    async createPrescription(req, res) {
        try {
            const prescription = req.body;
            const prescriptionId = await PrescriptionService.createPrescription(prescription);
            res.status(201).json({ id: prescriptionId });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Update prescription by ID
    async updatePrescription(req, res) {
        try {
            const { id } = req.params;
            const prescription = req.body;
            await PrescriptionService.updatePrescription(id, prescription);
            res.status(200).json({ message: 'Prescription updated successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Delete prescription by ID
    async deletePrescription(req, res) {
        try {
            const { id } = req.params;
            await PrescriptionService.deletePrescription(id);
            res.status(200).json({ message: 'Prescription deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get prescriptions by patient ID
    async getPrescriptionsByPatient(req, res) {
        const { patient_id } = req.query;

        try {
            const prescriptions = await PrescriptionService.getPrescriptionsByPatient(patient_id);
            res.status(200).json(prescriptions);
        } catch (error) {
            console.error(`Error fetching prescriptions for patient ${patient_id}:`, error);
            res.status(500).json({ message: 'Error fetching prescriptions' });
        }
    }
}

module.exports = new PrescriptionController();
