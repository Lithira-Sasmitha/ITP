const Payment = require("../../models/financialModel/paymentmodel");

// @desc    Create a new payment
// @route   POST /api/payments
// @access  Public or Protected (depends on your auth setup)
exports.createPayment = async (req, res) => {
  try {
    const {
      ownerName,
      accountNumber,
      bank,
      expiry,
      cvd,
      totalAmount,
      deliveryCharge,
    } = req.body;

    // Optional: Validate required fields
    if (
      !ownerName ||
      !accountNumber ||
      !bank ||
      !expiry ||
      !cvd ||
      totalAmount == null ||
      deliveryCharge == null
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newPayment = new Payment({
      ownerName,
      accountNumber,
      bank,
      expiry,
      cvd,
      totalAmount,
      deliveryCharge,
    });

    await newPayment.save();

    res.status(201).json({
      message: "Payment recorded successfully",
      payment: newPayment,
    });
  } catch (error) {
    console.error("Payment creation error:", error);
    res.status(500).json({ message: "Error processing payment" });
  }
};


exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.status(200).json(payments);
  } catch (error) {
    console.error("Payment fetch error:", error);
    res.status(500).json({ message: "Error fetching payments" });
  }
};
