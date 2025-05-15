const Machine = require("../../models/machineModel/Machine");

// Create a new machine
exports.createMachine = async (req, res) => {
  try {
    const { name, id, status, purchaseDate, warrantyDate, value } = req.body;

    if (!name || !id || !status || !purchaseDate || !warrantyDate || !value) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newMachine = new Machine(req.body);
    await newMachine.save();

    res.status(201).json({
      success: true,
      message: "Machine added successfully",
      data: newMachine,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding machine",
      error: error.message,
    });
  }
};

// Get all machines
exports.getAllMachines = async (req, res) => {
  try {
    const machines = await Machine.find();
    res.status(200).json({
      success: true,
      data: machines,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching machines",
      error: error.message,
    });
  }
};

// Get a single machine by ID
exports.getMachineById = async (req, res) => {
  try {
    const machine = await Machine.findById(req.params.id);
    if (!machine) return res.status(404).json({ success: false, message: "Machine not found" });
    res.status(200).json({
      success: true,
      data: machine,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching machine",
      error: error.message,
    });
  }
};

// Update a machine by ID
exports.updateMachine = async (req, res) => {
  try {
    const updatedMachine = await Machine.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedMachine) {
      return res.status(404).json({ success: false, message: "Machine not found" });
    }
    res.status(200).json({
      success: true,
      message: "Machine updated successfully",
      data: updatedMachine,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating machine",
      error: error.message,
    });
  }
};

// Delete a machine by ID
exports.deleteMachine = async (req, res) => {
  try {
    const deletedMachine = await Machine.findByIdAndDelete(req.params.id);
    if (!deletedMachine) {
      return res.status(404).json({ success: false, message: "Machine not found" });
    }
    res.status(200).json({
      success: true,
      message: "Machine deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting machine",
      error: error.message,
    });
  }
};