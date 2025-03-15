const mongoose = require("mongoose");

const rawMaterialSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String }, 
  reorder_level: { type: Number, default: 0 },
  unit_price: { type: Number },
  supplier_name: { type: String },
  supplier_email: { type: String },
  supplier_phone: { type: String },
  location: { type: String, enum: ["Storage Room 1", "Storage Room 2", "Storage Room 3", "Main Rack Zone", "Cold Room"], default: "Storage Room 1" },
  received_date: { type:  Date, default: Date.now },
  expiry_date: { type: Date },
  status: { type: String, enum: ["In Stock", "Low Stock", "Out of Stock"], default: "In Stock" },
  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("RawMaterial", rawMaterialSchema);
