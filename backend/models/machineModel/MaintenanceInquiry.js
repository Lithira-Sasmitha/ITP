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
    issue: {
      type: String,
      required: true,
      minlength: 10,
    },
    isUnderWarranty: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["pending", "inprogress", "complete", "reject"],
      default: "pending",
    },
    dateSubmitted: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MaintenanceInquiry", maintenanceInquirySchema);
