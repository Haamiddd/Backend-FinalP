const express = require('express');
const appointmentController = require('../controllers/AppointmentController');

const router = express.Router();

router.get('/appointments', appointmentController.getAllAppointments);
router.get('/appointments/:appointment_id', appointmentController.getAppointmentById);
router.post('/appointments', appointmentController.createAppointment);
router.put('/appointments/:appointment_id', appointmentController.updateAppointment);
router.delete('/appointments/:appointment_id', appointmentController.deleteAppointment);
router.get('/apointPaiDoc', appointmentController.getAppointmentsWithDetails);
router.put('/appointmentStatus/:appointment_id', appointmentController.updateAppointmentStatus);
router.get('/appointments/booked-times', appointmentController.getBookedTimes);

module.exports = router;
