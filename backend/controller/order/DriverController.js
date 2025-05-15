const Driver = require("../../models/orderModel/Driver");

// ✅ Create a new driver
exports.createDriver = async (req, res) => {
  try {
    const { name, dob, nic, telephone, vehicle, vehicleRegNo, licenseNo } =
      req.body;

    if (
      !name ||
      !dob ||
      !nic ||
      !telephone ||
      !vehicle ||
      !vehicleRegNo ||
      !licenseNo
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingDriver = await Driver.findOne({ nic });
    if (existingDriver) {
      return res
        .status(400)
        .json({ message: "Driver with this NIC already exists" });
    }

    const newDriver = new Driver(req.body);
    await newDriver.save();

    res
      .status(201)
      .json({ message: "Driver added successfully", driver: newDriver });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding driver", error: error.message });
  }
};

// ✅ Get all drivers
exports.getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.status(200).json(drivers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching drivers", error: error.message });
  }
};

// ✅ Get a single driver by ID
exports.getDriverById = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) return res.status(404).json({ message: "Driver not found" });
    res.status(200).json(driver);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching driver", error: error.message });
  }
};

// ✅ Update a driver by ID
exports.updateDriver = async (req, res) => {
  try {
    const updatedDriver = await Driver.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedDriver) {
      return res.status(404).json({ message: "Driver not found" });
    }
    res
      .status(200)
      .json({ message: "Driver updated successfully", driver: updatedDriver });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating driver", error: error.message });
  }
};

// ✅ Delete a driver by ID
exports.deleteDriver = async (req, res) => {
  try {
    const deletedDriver = await Driver.findByIdAndDelete(req.params.id);
    if (!deletedDriver) {
      return res.status(404).json({ message: "Driver not found" });
    }
    res.status(200).json({ message: "Driver deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting driver", error: error.message });
  }
};
