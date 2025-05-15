const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order_id: { type: String, required: true },
  fullName: { type: String, required: true },
  selectedproduct_type: [
    {
      title: { type: String, required: true },
      price: { type: Number, required: true },
    },
  ],
  total: { type: Number, required: true },
  paymentStatus: { type: String, default: "Pending" },
  cardDetails: {
    cardNumber: { type: String, required: true },
    nameOnCard: { type: String, required: true },
    expiryDate: { type: String, required: true },
    cvv: { type: String, required: true }
  },
  createdAt: { type: Date, default: Date.now }
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;