const mongoose = require("mongoose");

const machineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    status: { type: String, default: "Active" },
    purchaseDate: { type: Date },
    warrantyDate: { type: Date },
    value: { type: Number, required: true },
  },
  { timestamps: true }
);

const Machine = mongoose.model("Machine", machineSchema);

module.exports = Machine;