const express = require('express');
const doctorController = require('../controllers/doctorController');

const router = express.Router();

router.get('/doctors', doctorController.getAllDoctors);
router.get('/doctors/:doctor_id', doctorController.getDoctorById);
router.post('/doctors', doctorController.createDoctor);
router.put('/doctors/:doctor_id', doctorController.updateDoctor);
router.delete('/doctors/:doctor_id', doctorController.deleteDoctor);
// Patient login route
router.post('/doctor/login', doctorController.login);

module.exports = router;
