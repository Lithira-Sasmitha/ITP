
const express = require('express');
const router = express.Router();
const { sendEmail } = require('../../controller/inventory/warehouseEmailController');

// POST /api/email/send
router.post('/send', sendEmail);

module.exports = router;