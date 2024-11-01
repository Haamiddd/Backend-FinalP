const db = require('../config/db');  // Ensure the database connection
const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const { promisify } = require('util');

// Promisify fs.readFile for async/await usage
const readFile = promisify(fs.readFile);
const parser = new xml2js.Parser();

let queries = {};

// Load XML queries from the file
const loadQueries = async () => {
    try {
        const data = await readFile(path.join(__dirname, '../sql/AppointmentQueries.xml'), 'utf-8');
        const result = await parser.parseStringPromise(data);
        queries = result.queries;
    } catch (err) {
        console.error('Error loading SQL queries:', err);
    }
};

// Initialize queries on server start
loadQueries();

class AppointmentService {

  // Get all appointments
  async getAllAppointments() {
    const sql = queries.getAllAppointments[0];
    try {
      const [rows] = await db.query(sql);
      return rows;
    } catch (err) {
      throw new Error(`Error fetching Booking: ${err.message}`);
    }
  }

  // Get an appointment by ID
  async getAppointmentById(id) {
    const sql = queries.getAppointmentById[0];
    try {
      const [result] = await db.query(sql, [id]);
      return result.length > 0 ? result[0] : null;
    } catch (err) {
      throw new Error(`Error fetching Booking with ID ${id}: ${err.message}`);
    }
  }

  // Create a new appointment
  async createAppointment(appointment) {
    const { patient_id, doctor_id, appointment_date, appointment_time, appointment_type, status, payment_status, payment_amount } = appointment;
    const sql = queries.createAppointment[0];
    try {
      const [result] = await db.query(sql, [
        patient_id,
        doctor_id,
        appointment_date,
        appointment_time,
        appointment_type,
        status,
        payment_status,
        payment_amount
      ]);
      return result.insertId;
    } catch (err) {
      throw new Error(`Error creating Booking: ${err.message}`);
    }
  }

  // Update an appointment by ID
  async updateAppointment(id, appointment) {
    const { patient_id, doctor_id, appointment_date, appointment_time, appointment_type, status, payment_status, payment_amount } = appointment;
    const sql = queries.updateAppointment[0];
    try {
      await db.query(sql, [
        patient_id,
        doctor_id,
        appointment_date,
        appointment_time,
        appointment_type,
        status,
        payment_status,
        payment_amount,
        id
      ]);
    } catch (err) {
      throw new Error(`Error updating Booking with ID ${id}: ${err.message}`);
    }
  }

  // Delete an appointment by ID
  async deleteAppointment(id) {
    const sql = queries.deleteAppointment[0];
    try {
      await db.query(sql, [id]);
    } catch (err) {
      throw new Error(`Error deleting Booking with ID ${id}: ${err.message}`);
    }
  }

  // Fetch appointments with patient and doctor names
  async getAppointmentsWithDetails() {
    const sql = queries.getAppointmentsWithDetails[0];
    try {
      const [rows] = await db.query(sql);
      return rows;
    } catch (err) {
      throw new Error(`Error fetching Booking with details: ${err.message}`);
    }
  }

  // Update appointment status
  async updateAppointmentStatus(appointment_id, status) {
    const sql = queries.updateAppointmentStatus[0];
    try {
      await db.query(sql, [status, appointment_id]);
    } catch (err) {
      throw new Error(`Error updating Booking status: ${err.message}`);
    }
  }

  // Get booked times for a doctor on a specific date
  async getBookedTimes(doctor_id, appointment_date) {
    const sql = queries.getBookedTimes[0];
    try {
      const [rows] = await db.query(sql, [doctor_id, appointment_date]);
      return rows.map(row => row.appointment_time.substr(0, 5)); // Ensure time is in 'HH:mm' format
    } catch (err) {
      throw new Error(`Error fetching booked times: ${err.message}`);
    }
  }
}

module.exports = new AppointmentService();
