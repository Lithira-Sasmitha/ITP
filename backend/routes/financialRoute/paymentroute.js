const express = require("express");
const router = express.Router();
const paymentController = require("../../controller/financial/paymentCrt");

// Get all payments
router.get('/', paymentController.getAllPayments);

// Get a specific payment by ID
router.get('/:id', paymentController.getPaymentById);

// Update payment status
router.put('/:id', paymentController.updatePaymentStatus);

// Create a new payment
router.post('/create-payment', paymentController.createPayment);

// Generate QR code
router.get('/generate-qr/:order_id', paymentController.generateQR);

// Download summary
router.get('/download-summary/:order_id', paymentController.downloadSummary);

// Track order
router.get('/track-order/:order_id', paymentController.trackOrder);

module.exports = router;