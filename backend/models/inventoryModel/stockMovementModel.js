const mongoose = require('mongoose');

const stockMovementSchema = new mongoose.Schema(
  {
    productType: { type: String,enum: ['Final', 'Raw', 'Packing'], required: true }, 
    productId: { type: mongoose.Schema.Types.ObjectId,  required: true, refPath: 'productTypeRef' },
    productName: {  type: String,required: true,trim: true},
    productTypeRef: { type: String,required: true,enum: ['FinalProduct', 'RawMaterial', 'PackingMaterial'],},
    movementType: { type: String, enum: ['IN', 'OUT'], required: true },
    quantity: { type: Number, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('StockMovement', stockMovementSchema);