const appointmentService = require('../services/AppointmentService');

class AppointmentController {

  async getAllAppointments(req, res) {
    try {
      const appointments = await appointmentService.getAllAppointments();
      res.json(appointments);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getAppointmentById(req, res) {
    try {
      const appointment = await appointmentService.getAppointmentById(req.params.appointment_id);
      if (appointment) {
        res.json(appointment);
      } else {
        res.status(404).json({ message: 'Booking not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async createAppointment(req, res) {
    try {
      const appointmentId = await appointmentService.createAppointment(req.body);
      res.status(201).json({ id: appointmentId });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async updateAppointment(req, res) {
    try {
      await appointmentService.updateAppointment(req.params.appointment_id, req.body);
      res.status(200).json({ message: 'Booking updated successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async deleteAppointment(req, res) {
    try {
      await appointmentService.deleteAppointment(req.params.appointment_id);
      res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
// Controller to fetch appointments with patient and doctor details
async getAppointmentsWithDetails(req, res) {
  try {
    const appointments = await appointmentService.getAppointmentsWithDetails();
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Controller to update appointment status
async updateAppointmentStatus(req, res) {
  try {
    await appointmentService.updateAppointmentStatus(req.params.appointment_id, req.body.status);
    res.status(200).json({ message: 'Booking status updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Controller for fetching booked times
 // API to get booked times for a doctor on a specific date
 async getBookedTimes(req, res) {
  const { doctor_id, appointment_date } = req.query;
  try {
      const bookedTimes = await AppointmentService.getBookedTimes(doctor_id, appointment_date);
      res.status(200).json(bookedTimes);
  } catch (error) {
      res.status(500).json({ error: 'Error fetching booked times' });
  }
}
}

module.exports = new AppointmentController();
