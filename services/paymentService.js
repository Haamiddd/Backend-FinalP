const db = require('../config/db');  // Using the promise-based db connection

// Create a new payment
exports.createPayment = async (appointment_id, patient_id, payment_type, amount, status) => {
    const query = `INSERT INTO payments (appointment_id, patient_id, payment_type, amount, status) VALUES (?, ?, ?, ?, ?)`;
    const [result] = await db.execute(query, [appointment_id, patient_id, payment_type, amount, status]);
    return { payment_id: result.insertId, appointment_id, patient_id, payment_type, amount, status };
};

// Get all payments
exports.getAllPayments = async () => {
    const query = `SELECT * FROM payments`;
    const [payments] = await db.execute(query);
    return payments;
};

// Get a payment by ID
exports.getPaymentById = async (id) => {
    const query = `SELECT * FROM payments WHERE payment_id = ?`;
    const [payment] = await db.execute(query, [id]);
    return payment.length > 0 ? payment[0] : null;
};

// Update payment status
exports.updatePaymentStatus = async (id, status) => {
    const query = `UPDATE payments SET status = ? WHERE payment_id = ?`;
    const [result] = await db.execute(query, [status, id]);
    return result.affectedRows > 0 ? { payment_id: id, status } : null;
};

// Delete a payment
exports.deletePayment = async (id) => {
    const query = `DELETE FROM payments WHERE payment_id = ?`;
    const [result] = await db.execute(query, [id]);
    return result.affectedRows > 0;
};
