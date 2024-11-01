const leaveService = require('../services/leaveService');

class LeaveController {
    // Fetch all leave requests
    async getAllLeaveRequests(req, res) {
        try {
            const leaveRequests = await leaveService.getAllLeaveRequests();
            res.json(leaveRequests);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Fetch leave request by ID
    async getLeaveRequestById(req, res) {
        try {
            const leaveRequest = await leaveService.getLeaveRequestById(req.params.leave_id);
            if (leaveRequest) {
                res.json(leaveRequest);
            } else {
                res.status(404).json({ message: 'Leave request not found' });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Create a new leave request
    async createLeaveRequest(req, res) {
        try {
            const leaveId = await leaveService.createLeaveRequest(req.body);
            res.status(201).json({ leave_id: leaveId });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

   // Separate API to update leave request status only
   async updateLeaveRequestStatus(req, res) {
    try {
        const leaveId = req.params.leave_id;
        const { status } = req.body;

        // Validate if status is provided
        if (!status) {
            return res.status(400).json({ message: 'Status is required.' });
        }

        // Update the status only
        await leaveService.updateLeaveRequestStatus(leaveId, status);

        res.status(200).json({ message: 'Leave request status updated successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// API to edit the full leave request details (used in employee leave editing)
async updateLeaveRequest(req, res) {
    try {
        const leaveId = req.params.leave_id;
        const data = req.body;

        // Call the service to update the leave request
        await leaveService.updateLeaveRequest(leaveId, data);

        res.status(200).json({ message: 'Leave request updated successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
    // Delete leave request
    async deleteLeaveRequest(req, res) {
        try {
            await leaveService.deleteLeaveRequest(req.params.leave_id);
            res.status(200).json({ message: 'Leave request deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = new LeaveController();
