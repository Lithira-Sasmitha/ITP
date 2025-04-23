const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  ownerName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  bank: { type: String, required: true },
  expiry: { type: String, required: true }, // Stored as YYYY-MM format
  cvd: { type: String, required: true }, // Ideally encrypted
  totalAmount: { type: Number, required: true },
  deliveryCharge: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", paymentSchema);
