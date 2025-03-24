const MachinePart = require("../../models/machineModel/MachinePart");

// Create a new machine part
exports.createMachinePart = async (req, res) => {
  try {
    const {machinepartName, machinepartId, machinepartPurchaseDate , machinepartWarrantyPeriod, machinepartValue } = req.body;

    if (!machinepartName || !machinepartId || !machinepartPurchaseDate || !machinepartWarrantyPeriod || !machinepartValue) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newMachinePart = new MachinePart(req.body);
    await newMachinePart.save();

    res
      .status(201)
      .json({ message: "Machine Part added successfully", machinepart: newMachinePart });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding machine part", error: error.message });
  }
};

// Get all machines part
exports.getAllMachineParts = async (req, res) => {
  try {
    const machineparts = await MachinePart.find();
    res.status(200).json(machineparts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching machine parts", error: error.message });
  }
};

// Get a single machine part by ID
exports.getMachinePartById = async (req, res) => {
  try {
    const machinepart = await MachinePart.findById(req.params.id);
    if (!machinepart) return res.status(404).json({ message: "Machine Part not found" });
    res.status(200).json(machinepart);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching machine part", error: error.message });
  }
};

// Update a machine part by ID
exports.updateMachinePart = async (req, res) => {
  try {
    const updatedMachinePart = await MachinePart.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedMachinePart) {
      return res.status(404).json({ message: "Machine Part not found" });
    }
    res
      .status(200)
      .json({
        message: "Machine Part updated successfully",
        machinepart: updatedMachinePart,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating machine part", error: error.message });
  }
};

// Delete a machine part by ID
exports.deleteMachinePart = async (req, res) => {
  try {
    const deletedMachinePart = await MachinePart.findByIdAndDelete(req.params.id);
    if (!deletedMachinePart) {
      return res.status(404).json({ message: "Machine Part not found" });
    }
    res.status(200).json({ message: "Machine Part deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting machine part", error: error.message });
  }
};