const db = require('../config/db');

class RevenueService {
    // Fetch revenue data for a specific doctor and date
    async getRevenueByDoctorAndDate(doctorId, appointmentDate) {
        const sql = `SELECT appointment_date, SUM(payment_amount) AS total_amount 
                     FROM revenue 
                     WHERE doctor_id = ? AND appointment_date = ? 
                     GROUP BY appointment_date`;
        try {
            const [rows] = await db.query(sql, [doctorId, appointmentDate]);
            return rows;
        } catch (err) {
            throw new Error(`Error fetching revenue data: ${err.message}`);
        }
    }
}

module.exports = new RevenueService();
