const MachinePart = require("../../models/machineModel/MachinePart");
const Machine = require("../../models/machineModel/Machine");

// Create a new machine part
exports.createMachinePart = async (req, res) => {
  try {
    const {
      machinepartName,
      machinepartId,
      machinepartPurchaseDate,
      machinepartWarrantyPeriod,
      machinepartValue,
      machineId,
    } = req.body;

    // Validate required fields
    if (
      !machinepartName ||
      !machinepartId ||
      !machinepartValue ||
      !machineId ||
      !machinepartWarrantyPeriod
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Required fields are missing. Please provide part name, ID, value, machine ID, and warranty period.",
      });
    }

    // Verify machine exists and get machine name
    const machine = await Machine.findById(machineId);
    if (!machine) {
      return res.status(404).json({
        success: false,
        message: "Machine not found",
      });
    }

    const newMachinePart = new MachinePart({
      machinepartName,
      machinepartId,
      machinepartPurchaseDate,
      machinepartWarrantyPeriod,
      machinepartValue,
      machineId,
      machineName: machine.name,
    });
    await newMachinePart.save();

    res.status(201).json({
      success: true,
      message: "Machine Part added successfully",
      data: newMachinePart,
    });
  } catch (error) {
    console.error("Error creating machine part:", error);
    res.status(500).json({
      success: false,
      message: "Error adding machine part",
      error: error.message,
    });
  }
};

// Get all machine parts
exports.getAllMachineParts = async (req, res) => {
  try {
    const machineParts = await MachinePart.find();
    res.status(200).json({
      success: true,
      data: machineParts,
    });
  } catch (error) {
    console.error("Error fetching machine parts:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching machine parts",
      error: error.message,
    });
  }
};

// Get a single machine part by ID
exports.getMachinePartById = async (req, res) => {
  try {
    const machinePart = await MachinePart.findById(req.params.id);
    if (!machinePart) {
      return res.status(404).json({
        success: false,
        message: "Machine Part not found",
      });
    }
    res.status(200).json({
      success: true,
      data: machinePart,
    });
  } catch (error) {
    console.error("Error fetching machine part:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching machine part",
      error: error.message,
    });
  }
};

// Update a machine part by ID
exports.updateMachinePart = async (req, res) => {
  try {
    const { machineId } = req.body;

    // If machineId is provided, verify machine exists and get machine name
    if (machineId) {
      const machine = await Machine.findById(machineId);
      if (!machine) {
        return res.status(404).json({
          success: false,
          message: "Machine not found",
        });
      }
      req.body.machineName = machine.name;
    }

    const updatedMachinePart = await MachinePart.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedMachinePart) {
      return res.status(404).json({
        success: false,
        message: "Machine Part not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Machine Part updated successfully",
      data: updatedMachinePart,
    });
  } catch (error) {
    console.error("Error updating machine part:", error);
    res.status(500).json({
      success: false,
      message: "Error updating machine part",
      error: error.message,
    });
  }
};

// Delete a machine part by ID
exports.deleteMachinePart = async (req, res) => {
  try {
    const deletedMachinePart = await MachinePart.findByIdAndDelete(
      req.params.id
    );
    if (!deletedMachinePart) {
      return res.status(404).json({
        success: false,
        message: "Machine Part not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Machine Part deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting machine part:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting machine part",
      error: error.message,
    });
  }
};
