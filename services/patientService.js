const db = require('../config/db');  // Using the promise-based db connection
const bcrypt = require('bcryptjs');  // For password hashing
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
        const data = await readFile(path.join(__dirname, '../sql/PatientQueries.xml'), 'utf-8');
        const result = await parser.parseStringPromise(data);
        queries = result.queries;
    } catch (err) {
        console.error('Error loading SQL queries:', err);
    }
};

// Initialize queries on server start
loadQueries();

class PatientService {

    // Get all patients
    async getAllPatients() {
        const sql = queries.getAllPatients[0];
        try {
            const [rows] = await db.query(sql);
            return rows;
        } catch (err) {
            throw new Error(`Error fetching Users: ${err.message}`);
        }
    }

    // Get a single patient by ID
    async getPatientById(id) {
        const sql = queries.getPatientById[0];
        try {
            const [result] = await db.query(sql, [id]);
            return result.length > 0 ? result[0] : null;
        } catch (err) {
            throw new Error(`Error fetching Users with ID ${id}: ${err.message}`);
        }
    }

    // Get a single patient by email (for login)
    async getPatientByEmail(email) {
        const sql = queries.getPatientByEmail[0];
        try {
            const [result] = await db.query(sql, [email]);
            return result.length > 0 ? result[0] : null;
        } catch (err) {
            throw new Error(`Error fetching Users with email ${email}: ${err.message}`);
        }
    }

    // Create a new patient with password hashing
    async createPatient(patient) {
        const { name, email, phone, address, dob, insurance_details, emergency_contact_name, emergency_contact_phone, password } = patient;

        // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = queries.createPatient[0];
        try {
            const [result] = await db.query(sql, [
                name,
                email,
                phone,
                dob,
                address,
                
                insurance_details,
                emergency_contact_name,
                emergency_contact_phone,
                hashedPassword
            ]);
            return result.insertId;
        } catch (err) {
            throw new Error(`Error creating patient: ${err.message}`);
        }
    }

    // Update an existing patient by ID (without password field)
    async updatePatient(id, patient) {
        const { name, email, phone, address, dob, insurance_details, emergency_contact_name, emergency_contact_phone } = patient;
        const sql = queries.updatePatient[0];
        try {
            await db.query(sql, [
                name,
                email,
                phone,
                address,
                dob,
                insurance_details,
                emergency_contact_name,
                emergency_contact_phone,
                id
            ]);
        } catch (err) {
            throw new Error(`Error updating User with ID ${id}: ${err.message}`);
        }
    }

    // Delete a patient by ID
    async deletePatient(id) {
        const sql = queries.deletePatient[0];
        try {
            await db.query(sql, [id]);
        } catch (err) {
            throw new Error(`Error deleting Users with ID ${id}: ${err.message}`);
        }
    }
}

module.exports = new PatientService();
