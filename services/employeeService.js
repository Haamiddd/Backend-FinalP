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
        const data = await readFile(path.join(__dirname, '../sql/EmployeeQueries.xml'), 'utf-8');
        const result = await parser.parseStringPromise(data);
        queries = result.queries;
    } catch (err) {
        console.error('Error loading SQL queries:', err);
    }
};

// Initialize queries on server start
loadQueries();

class EmployeeService {

    // Get all employees
    async getAllEmployees() {
        const sql = queries.getAllEmployees[0];
        try {
            const [rows] = await db.query(sql);
            return rows;
        } catch (err) {
            throw new Error(`Error fetching employees: ${err.message}`);
        }
    }

    // Get a single employee by ID
    async getEmployeeById(id) {
        const sql = queries.getEmployeeById[0];
        try {
            const [result] = await db.query(sql, [id]);
            return result.length > 0 ? result[0] : null;
        } catch (err) {
            throw new Error(`Error fetching employee with ID ${id}: ${err.message}`);
        }
    }

    // Create a new employee (with password hashing)
    async createEmployee(employee) {
        const { name, email, phone, role, department, date_of_joining, salary, leave_balance, password } = employee;
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = queries.createEmployee[0];
        try {
            const [result] = await db.query(sql, [name, email, phone, role, department, date_of_joining, salary, leave_balance, hashedPassword]);
            return result.insertId;
        } catch (err) {
            throw new Error(`Error creating employee: ${err.message}`);
        }
    }

    // Update an existing employee by ID
    async updateEmployee(id, employee) {
        const { name, email, phone, role, department, date_of_joining, salary, leave_balance } = employee;
        const sql = queries.updateEmployee[0];
        try {
            await db.query(sql, [name, email, phone, role, department, date_of_joining, salary, leave_balance, id]);
        } catch (err) {
            throw new Error(`Error updating employee with ID ${id}: ${err.message}`);
        }
    }

    // Delete an employee by ID
    async deleteEmployee(id) {
        const sql = queries.deleteEmployee[0];
        try {
            await db.query(sql, [id]);
        } catch (err) {
            throw new Error(`Error deleting employee with ID ${id}: ${err.message}`);
        }
    }

    // Get employee by email
    async getEmployeeByEmail(email) {
        const sql = queries.getEmployeeByEmail[0];
        try {
            const [rows] = await db.query(sql, [email]);
            return rows.length > 0 ? rows[0] : null;
        } catch (err) {
            throw new Error(`Error fetching employee by email: ${err.message}`);
        }
    }
}

module.exports = new EmployeeService();
