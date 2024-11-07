// revenueRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Import database connection (replace with your db file path)

// Add a new revenue entry
router.post('/revenue', (req, res) => {
    const { doctor_id, appointment_date, payment_amount } = req.body;
    const query = 'INSERT INTO revenue (doctor_id, appointment_date, payment_amount) VALUES (?, ?, ?)';
    db.query(query, [doctor_id, appointment_date, payment_amount], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Revenue entry added successfully', id: result.insertId });
    });
});

// Get all revenue entries
router.get('/revenue', (req, res) => {
    const query = 'SELECT * FROM revenue';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Get revenue entries for a specific doctor
router.get('/revenue/:doctor_id', (req, res) => {
    const { doctor_id } = req.params;
    const query = 'SELECT * FROM revenue WHERE doctor_id = ?';
    db.query(query, [doctor_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Update a revenue entry by ID
router.put('/revenue/:id', (req, res) => {
    const { id } = req.params;
    const { doctor_id, appointment_date, payment_amount } = req.body;
    const query = 'UPDATE revenue SET doctor_id = ?, appointment_date = ?, payment_amount = ? WHERE id = ?';
    db.query(query, [doctor_id, appointment_date, payment_amount, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Revenue entry updated successfully' });
    });
});

// Delete a revenue entry by ID
router.delete('/revenue/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM revenue WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Revenue entry deleted successfully' });
    });
});

module.exports = router;
