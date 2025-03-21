const mongoose = require('mongoose');

const stockMovementSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'productType' },
  quantity: { type: Number, required: true },
  type: { type: String, enum: ['In', 'Out'], required: true },
  location: { type: String, required: true },
  productType: { type: String, enum: ['RawMaterial', 'PackingMaterial', 'FinalProduct'], required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('StockMovement', stockMovementSchema);
