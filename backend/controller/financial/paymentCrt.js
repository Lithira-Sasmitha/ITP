const { IncomeTransaction } = require("../../models/financialModel/incomemodel");
const Payment = require("../../models/financialModel/paymentmodel");

// Get all payments
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find();
    res.status(200).json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a specific payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.status(200).json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update payment status
// Update payment status
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    // Validate ID
    if (!id) {
      return res.status(400).json({ message: 'Payment ID is required.' });
    }

    // Validate paymentStatus
    if (!paymentStatus) {
      return res.status(400).json({ message: 'Payment status is required.' });
    }

    // Find the payment first to get all necessary details
    const payment = await Payment.findById(id);
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found.' });
    }

    // Update payment status
    payment.paymentStatus = paymentStatus;
    const updatedPayment = await payment.save();

    // If payment status is "Complete", create a new transaction
    if (paymentStatus === "Complete") {
      // Get payment details to use for the transaction
      const newTransaction = new IncomeTransaction({
        name: payment.fullName || "Payment Transaction",
        type: "Income", // As requested in the requirements
        amount: payment.total || 0,
        date: new Date(),
        paymentId: payment._id,
        orderId: payment.order_id || null
      });

      // Save the new transaction
      await newTransaction.save();
      
      console.log('New transaction created:', newTransaction);
    }

    res.status(200).json({ 
      success: true, 
      message: 'Payment status updated successfully.', 
      updatedPayment 
    });
  } catch (err) {
    console.error('Error updating payment status:', err);
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

// Create a payment
// Create a payment
exports.createPayment = async (req, res) => {
  try {
    const { 
      order_id, 
      fullName, 
      selectedproduct_type, 
      total,
      cardDetails 
    } = req.body;

    if (!order_id || !fullName || !selectedproduct_type || !total || !cardDetails) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newPayment = new Payment({
      order_id,
      fullName,
      selectedproduct_type,
      total,
      cardDetails: {
        cardNumber: cardDetails.cardNumber,
        nameOnCard: cardDetails.nameOnCard,
        expiryDate: cardDetails.expiryDate,
        cvv: cardDetails.cvv
      }
    });

    await newPayment.save();
    res.status(201).json(newPayment);
  } catch (err) {   
    res.status(500).json({ message: err.message });
  }
}; 

// Generate QR code (mocked)
exports.generateQR = (req, res) => {
  const { order_id } = req.params;
  const qrCodeUrl = `https://your-website.com/qr/${order_id}`;
  res.status(200).json({ success: true, qrCodeUrl });
};

// Download summary (mocked)
exports.downloadSummary = (req, res) => {
  const { order_id } = req.params;
  const summary = `Payment Summary for Order ID: ${order_id}`;
  res.status(200).json({ success: true, summary });
};

// Track order (mocked)
exports.trackOrder = (req, res) => {
  const { order_id } = req.params;
  const orderStatus = 'Shipped';
  res.status(200).json({ success: true, status: orderStatus });
};