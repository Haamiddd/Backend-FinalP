const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const xml2js = require('xml2js');
const db = require('../config/db');  // Ensure the database connection

// Read the XML file and parse it
const readFile = promisify(fs.readFile);
const parser = new xml2js.Parser();

let queries = {};

const loadQueries = async () => {
    try {
        const data = await readFile(path.join(__dirname, '../sql/PrescriptionQueries.xml'), 'utf-8');
        const result = await parser.parseStringPromise(data);
        queries = result.queries;
    } catch (err) {
        console.error('Error loading SQL queries:', err);
    }
};

// Initialize queries on server start
loadQueries();

class PrescriptionService {

  // Get all prescriptions
  async getAllPrescriptions() {
    const sql = queries.getAllPrescriptions[0];
    try {
      const [rows] = await db.query(sql);
      return rows;
    } catch (err) {
      throw new Error(`Error fetching prescriptions: ${err.message}`);
    }
  }

  // Get prescription by ID
  async getPrescriptionById(id) {
    const sql = queries.getPrescriptionById[0];
    try {
      const [result] = await db.query(sql, [id]);
      return result.length > 0 ? result[0] : null;
    } catch (err) {
      throw new Error(`Error fetching prescription with ID ${id}: ${err.message}`);
    }
  }

  // Create a new prescription
  async createPrescription(prescription) {
    const { patient_id, doctor_id, medicine_name, dosage, frequency, prescription_date, status } = prescription;
    const sql = queries.createPrescription[0];
    try {
      const [result] = await db.query(sql, [
        patient_id, doctor_id, medicine_name, dosage, frequency, prescription_date, status
      ]);
      return result.insertId;
    } catch (err) {
      throw new Error(`Error creating prescription: ${err.message}`);
    }
  }

  // Update a prescription by ID
  async updatePrescription(id, prescription) {
    const { patient_id, doctor_id, medicine_name, dosage, frequency, prescription_date, status } = prescription;
    const sql = queries.updatePrescription[0];
    try {
      await db.query(sql, [
        patient_id, doctor_id, medicine_name, dosage, frequency, prescription_date, status, id
      ]);
    } catch (err) {
      throw new Error(`Error updating prescription with ID ${id}: ${err.message}`);
    }
  }

  // Delete a prescription by ID
  async deletePrescription(id) {
    const sql = queries.deletePrescription[0];
    try {
      await db.query(sql, [id]);
    } catch (err) {
      throw new Error(`Error deleting prescription with ID ${id}: ${err.message}`);
    }
  }

  // Get prescriptions by patient ID
  async getPrescriptionsByPatient(patient_id) {
    const sql = queries.getPrescriptionsByPatient[0];
    try {
      const [rows] = await db.query(sql, [patient_id]);
      return rows;
    } catch (err) {
      throw new Error(`Error fetching prescriptions for patient ID ${patient_id}: ${err.message}`);
    }
  }
}

module.exports = new PrescriptionService();
