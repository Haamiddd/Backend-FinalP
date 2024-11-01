const db = require('../config/db');  // Using the promise-based db connection
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
        const data = await readFile(path.join(__dirname, '../sql/LeaveQueries.xml'), 'utf-8');
        const result = await parser.parseStringPromise(data);
        queries = result.queries;
    } catch (err) {
        console.error('Error loading SQL queries:', err);
    }
};

// Initialize queries on server start
loadQueries();

class LeaveService {

    // Get all leave requests
    async getAllLeaveRequests() {
        const sql = queries.getAllLeaveRequests[0];
        try {
            const [rows] = await db.query(sql);
            return rows;
        } catch (err) {
            throw new Error(`Error fetching leave requests: ${err.message}`);
        }
    }

    // Get leave request by ID
    async getLeaveRequestById(id) {
        const sql = queries.getLeaveRequestById[0];
        try {
            const [rows] = await db.query(sql, [id]);
            return rows.length > 0 ? rows[0] : null;
        } catch (err) {
            throw new Error(`Error fetching leave request with ID ${id}: ${err.message}`);
        }
    }

    // Create a new leave request
    async createLeaveRequest(leaveRequestData) {
        const { employee_id, start_date, end_date, leave_type, status, reason } = leaveRequestData;
        const sql = queries.createLeaveRequest[0];
        try {
            const [result] = await db.query(sql, [employee_id, start_date, end_date, leave_type, status, reason]);
            return result.insertId;
        } catch (err) {
            throw new Error(`Error creating leave request: ${err.message}`);
        }
    }

    // Update the status of the leave request
    async updateLeaveRequestStatus(leaveId, status) {
        const sql = queries.updateLeaveRequestStatus[0];
        try {
            await db.query(sql, [status, leaveId]);
        } catch (err) {
            throw new Error(`Error updating leave request status: ${err.message}`);
        }
    }

    // Update the entire leave request (for employee edit)
    async updateLeaveRequest(leaveId, data) {
        const { start_date, end_date, leave_type, reason } = data;
        const sql = queries.updateLeaveRequest[0];
        try {
            await db.query(sql, [start_date, end_date, leave_type, reason, leaveId]);
        } catch (err) {
            throw new Error(`Error updating leave request with ID ${leaveId}: ${err.message}`);
        }
    }

    // Delete a leave request
    async deleteLeaveRequest(leaveId) {
        const sql = queries.deleteLeaveRequest[0];
        try {
            await db.query(sql, [leaveId]);
        } catch (err) {
            throw new Error(`Error deleting leave request with ID ${leaveId}: ${err.message}`);
        }
    }
}

module.exports = new LeaveService();
