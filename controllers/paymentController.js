const paymentService = require('../services/paymentService');

// Create a new payment
exports.createPayment = async (req, res) => {
    try {
        const { appointment_id, patient_id, payment_type, amount, status } = req.body;
        const newPayment = await paymentService.createPayment(appointment_id, patient_id, payment_type, amount, status);
        res.status(201).json(newPayment);
    } catch (error) {
        res.status(500).json({ message: 'Error creating payment', error });
    }
};

// Get all payments
exports.getAllPayments = async (req, res) => {
    try {
        const payments = await paymentService.getAllPayments();
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving payments', error });
    }
};

// Get a payment by ID
exports.getPaymentById = async (req, res) => {
    try {
        const payment = await paymentService.getPaymentById(req.params.id);
        if (payment) {
            res.status(200).json(payment);
        } else {
            res.status(404).json({ message: 'Payment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving payment', error });
    }
};

// Update payment status by ID
exports.updatePaymentStatus = async (req, res) => {
    try {
        const updatedPayment = await paymentService.updatePaymentStatus(req.params.id, req.body.status);
        if (updatedPayment) {
            res.status(200).json(updatedPayment);
        } else {
            res.status(404).json({ message: 'Payment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating payment', error });
    }
};

// Delete a payment by ID
exports.deletePayment = async (req, res) => {
    try {
        const deletedPayment = await paymentService.deletePayment(req.params.id);
        if (deletedPayment) {
            res.status(200).json({ message: 'Payment deleted successfully' });
        } else {
            res.status(404).json({ message: 'Payment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting payment', error });
    }
};
