const express = require("express");
const router = express.Router();
const paymentController = require("../../controller/financial/paymentCrt");

// POST - Create new payment
router.post("/payments", paymentController.createPayment);

// GET - Get all payments (optional, for admin/reporting)
router.get("/payments", paymentController.getPayments);

module.exports = router;
