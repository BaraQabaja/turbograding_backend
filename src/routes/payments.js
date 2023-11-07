// routes/payments.js
const express = require('express');
const authenticateToken = require('../middleware/authenticateToken');
const paymentsController = require('../controllers/paymentController');

const router = express.Router();
/*
router.get('/', authenticateToken, paymentsController.getAllPayments);  // Fetch all payments
router.get('/:id', authenticateToken, paymentsController.getPayment);  // Fetch a specific payment
router.post('/', authenticateToken, paymentsController.createPayment);  // Create a new payment
router.put('/:id', authenticateToken, paymentsController.updatePayment);  // Update a payment
router.delete('/:id', authenticateToken, paymentsController.deletePayment);  // Delete a payment
*/
module.exports = router;
