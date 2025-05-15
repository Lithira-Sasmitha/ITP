const mongoose = require("mongoose");

const maintenanceInquirySchema = new mongoose.Schema(
  {
    machineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Machine",
      required: true,
    },
    partId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MachinePart",
      required: true,
    },
    issue: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "inprogress", "complete", "reject"],
      default: "pending",
    },
    isUnderWarranty: { type: Boolean, required: true },
    dateSubmitted: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const MaintenanceInquiry = mongoose.model(
  "MaintenanceInquiry",
  maintenanceInquirySchema
);

module.exports = MaintenanceInquiry;
