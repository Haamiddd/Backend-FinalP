const express = require('express');
const leaveController = require('../controllers/leaveController');

const router = express.Router();

// Get all leave requests
router.get('/leaverequests', leaveController.getAllLeaveRequests);

// Get leave request by ID
router.get('/leaverequests/:leave_id', leaveController.getLeaveRequestById);

// Create a new leave request
router.post('/leaverequests', leaveController.createLeaveRequest);

// Update leave request status (fixing other columns from getting null)
router.put('/leaverequests/:leave_id/status', leaveController.updateLeaveRequestStatus);

// Route for updating the full leave request (used in employee leave editing)
router.put('/leaverequests/:leave_id', leaveController.updateLeaveRequest);

// Delete a leave request
router.delete('/leaverequests/:leave_id', leaveController.deleteLeaveRequest);

module.exports = router;
