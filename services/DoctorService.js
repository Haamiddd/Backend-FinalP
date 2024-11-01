const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const xml2js = require('xml2js');
const db = require('../config/db');  // Ensure the database connection
const bcrypt = require('bcryptjs');  // For password hashing

// Read the XML file and parse it
const readFile = promisify(fs.readFile);
const parser = new xml2js.Parser();

let queries = {};

const loadQueries = async () => {
    try {
        const data = await readFile(path.join(__dirname, '../sql/DoctorQueries.xml'), 'utf-8');
        const result = await parser.parseStringPromise(data);
        queries = result.queries;
    } catch (err) {
        console.error('Error loading SQL queries:', err);
    }
};

// Initialize queries on server start
loadQueries();

class DoctorService {

  // Get all doctors
  async getAllDoctors() {
    const sql = queries.getAllDoctors[0];
    try {
      const [rows] = await db.query(sql);
      return rows;
    } catch (err) {
      throw new Error(`Error fetching Sport: ${err.message}`);
    }
  }

  // Get a doctor by ID
  async getDoctorById(id) {
    const sql = queries.getDoctorById[0];
    try {
      const [result] = await db.query(sql, [id]);
      return result.length > 0 ? result[0] : null;
    } catch (err) {
      throw new Error(`Error fetching doctor with ID ${id}: ${err.message}`);
    }
  }

  // Get a doctor by email (for login)
  async getDoctorByEmail(email) {
    const sql = queries.getDoctorByEmail[0];
    try {
      const [result] = await db.query(sql, [email]);
      return result.length > 0 ? result[0] : null;
    } catch (err) {
      throw new Error(`Error fetching Sport with email ${email}: ${err.message}`);
    }
  }

  // Create a new doctor (hashes the password before storing it)
  async createDoctor(doctor) {
    const { name, specialty, bio, years_of_experience, consultation_fee, email, phone, available_from, available_to, password } = doctor;

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password before storing

    const sql = queries.createDoctor[0];
    try {
      const [result] = await db.query(sql, [name, specialty, bio, years_of_experience, consultation_fee, email, phone, available_from, available_to, hashedPassword]);
      return result.insertId;
    } catch (err) {
      throw new Error(`Error creating Sport: ${err.message}`);
    }
  }

  // Update a doctor by ID
  async updateDoctor(id, doctor) {
    const { name, specialty, bio, years_of_experience, consultation_fee, email, phone, available_from, available_to } = doctor;
    const sql = queries.updateDoctor[0];
    try {
      await db.query(sql, [name, specialty, bio, years_of_experience, consultation_fee, email, phone, available_from, available_to, id]);
    } catch (err) {
      throw new Error(`Error updating Sport with ID ${id}: ${err.message}`);
    }
  }

  // Delete a doctor by ID
  async deleteDoctor(id) {
    const sql = queries.deleteDoctor[0];
    try {
      await db.query(sql, [id]);
    } catch (err) {
      throw new Error(`Error deleting Sport with ID ${id}: ${err.message}`);
    }
  }
}

module.exports = new DoctorService();
