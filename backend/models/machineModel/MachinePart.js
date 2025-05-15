const mongoose = require("mongoose");

const machinepartSchema = new mongoose.Schema(
  {
    machinepartName: { type: String, required: true },
    machinepartId: { type: String, required: true, unique: true },
    machinepartPurchaseDate: { type: Date },
    machinepartWarrantyPeriod: { type: Number, required: true },
    machinepartValue: { type: Number, required: true },
    machineId: { type: String, required: true },
    machineName: { type: String, required: true },
  },
  { timestamps: true }
);

const MachinePart = mongoose.model("MachinePart", machinepartSchema);

module.exports = MachinePart;
