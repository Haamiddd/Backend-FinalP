const express = require('express');
const router = express.Router();
const RevenueService = require('../services/revenueService');

// Endpoint to get revenue data for a doctor on a specific date
router.get('/revenue/:doctorId', async (req, res) => {
    const { doctorId } = req.params;
    const { date } = req.query;

    try {
        const revenueData = await RevenueService.getRevenueByDoctorAndDate(doctorId, date);
        res.json(revenueData);
    } catch (error) {
        console.error('Error fetching revenue data:', error);
        res.status(500).json({ message: 'Error fetching revenue data' });
    }
});

module.exports = router;
