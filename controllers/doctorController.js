const doctorService = require('../services/DoctorService');
const bcrypt = require('bcryptjs');

class DoctorController {

  // Get all doctors
  async getAllDoctors(req, res) {
    try {
      const doctors = await doctorService.getAllDoctors();
      res.json(doctors);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Get doctor by ID
  async getDoctorById(req, res) {
    try {
      const doctor = await doctorService.getDoctorById(req.params.doctor_id);
      if (doctor) {
        res.json(doctor);
      } else {
        res.status(404).json({ message: 'Doctor not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Create a new doctor
  async createDoctor(req, res) {
    try {
      const doctorId = await doctorService.createDoctor(req.body);
      res.status(201).json({ id: doctorId });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Update a doctor
  async updateDoctor(req, res) {
    try {
      await doctorService.updateDoctor(req.params.doctor_id, req.body);
      res.status(200).json({ message: 'Doctor updated successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Delete a doctor
  async deleteDoctor(req, res) {
    try {
      await doctorService.deleteDoctor(req.params.doctor_id);
      res.status(200).json({ message: 'Doctor deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Doctor login
  async login(req, res) {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
      // Find doctor by email
      const doctor = await doctorService.getDoctorByEmail(email);
      if (!doctor) {
        return res.status(400).json({ message: 'Invalid email or password.' });
      }

      // Compare the password
      const isPasswordValid = await bcrypt.compare(password, doctor.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid email or password.' });
      }

      // If valid, return doctor data
      res.status(200).json({ message: 'Login successful', doctor });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

}

module.exports = new DoctorController();
