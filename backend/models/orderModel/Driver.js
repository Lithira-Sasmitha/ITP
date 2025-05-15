const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    dob: { type: String, required: true },

    nic: { type: String, required: true, unique: true },
    telephone: { type: String, required: true },
    vehicle: { type: String, required: true },
    vehicleRegNo: { type: String, required: true, unique: true },
    licenseNo: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const Driver = mongoose.model("Driver", driverSchema);

module.exports = Driver;
