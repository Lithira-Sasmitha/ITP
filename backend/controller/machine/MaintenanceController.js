const MaintenanceRequest = require("../../models/machineModel/MaintenanceInquiry");
const Machine = require("../../models/machineModel/Machine");
const MachinePart = require("../../models/machineModel/MachinePart");
const mongoose = require("mongoose");

// Create a new maintenance inquiry
exports.createMaintenanceInquiry = async (req, res) => {
  try {
    const { machineId, partId, issue, isUnderWarranty } = req.body;

    // Validate required fields
    if (!machineId || !partId || !issue) {
      return res.status(400).json({
        success: false,
        message: "Machine ID, Part ID, and Issue are required",
      });
    }

    // Validate ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(machineId) ||
      !mongoose.Types.ObjectId.isValid(partId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Machine ID or Part ID",
      });
    }

    const maintenanceRequest = new MaintenanceRequest({
      machineId,
      partId,
      issue,
      isUnderWarranty,
    });

    const savedRequest = await maintenanceRequest.save();

    res.status(201).json({
      success: true,
      message: "Maintenance request created successfully",
      data: savedRequest,
    });
  } catch (error) {
    console.error("Error creating maintenance request:", error);
    res.status(500).json({
      success: false,
      message: "Error creating maintenance request",
      error: error.message,
    });
  }
};

// Get all maintenance inquiries
exports.getAllMaintenanceInquiries = async (req, res) => {
  try {
    const maintenanceRequests = await MaintenanceRequest.find()
      .populate("machineId", "name id")
      .populate("partId", "machinepartName machinepartId")
      .sort({ dateSubmitted: -1 });

    res.status(200).json({
      success: true,
      data: maintenanceRequests,
    });
  } catch (error) {
    console.error("Error fetching maintenance requests:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching maintenance requests",
      error: error.message,
    });
  }
};

// Delete a maintenance inquiry
exports.deleteMaintenanceInquiry = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Maintenance Inquiry ID",
      });
    }

    const maintenanceRequest = await MaintenanceRequest.findByIdAndDelete(id);

    if (!maintenanceRequest) {
      return res.status(404).json({
        success: false,
        message: "Maintenance request not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Maintenance request deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting maintenance request:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting maintenance request",
      error: error.message,
    });
  }
};

// Update maintenance inquiry status
exports.updateMaintenanceInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Maintenance Inquiry ID",
      });
    }

    // Validate status
    const validStatuses = ["pending", "inprogress", "complete", "reject"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const maintenanceRequest = await MaintenanceRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate("machineId", "name id")
      .populate("partId", "machinepartName machinepartId");

    if (!maintenanceRequest) {
      return res.status(404).json({
        success: false,
        message: "Maintenance request not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Maintenance request status updated successfully",
      data: maintenanceRequest,
    });
  } catch (error) {
    console.error("Error updating maintenance request status:", error);
    res.status(500).json({
      success: false,
      message: "Error updating maintenance request status",
      error: error.message,
    });
  }
};

// Check warranty status
exports.checkWarrantyStatus = async (req, res) => {
  try {
    const { machineId, partId } = req.params;

    // Validate ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(machineId) ||
      !mongoose.Types.ObjectId.isValid(partId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Machine ID or Part ID",
      });
    }

    // Find the machine in the database
    const machine = await Machine.findById(machineId);

    if (!machine) {
      return res.status(404).json({
        success: false,
        message: "Machine not found",
      });
    }

    // Find the part in the machine's parts array
    const part = await MachinePart.findById(partId);

    if (!part) {
      return res.status(404).json({
        success: false,
        message: "Part not found",
      });
    }

    // Check if machine and part are under warranty
    const currentDate = new Date();
    const machineUnderWarranty =
      machine.warrantyEndDate &&
      currentDate <= new Date(machine.warrantyEndDate);
    const partUnderWarranty =
      part.machinepartPurchaseDate &&
      part.machinepartWarrantyPeriod &&
      currentDate <=
        new Date(
          new Date(part.machinepartPurchaseDate).setMonth(
            new Date(part.machinepartPurchaseDate).getMonth() +
              part.machinepartWarrantyPeriod
          )
        );

    res.status(200).json({
      success: true,
      isUnderWarranty: machineUnderWarranty && partUnderWarranty,
      machineWarrantyEndDate: machine.warrantyEndDate,
      partWarrantyEndDate: part.machinepartPurchaseDate
        ? new Date(
            new Date(part.machinepartPurchaseDate).setMonth(
              new Date(part.machinepartPurchaseDate).getMonth() +
                part.machinepartWarrantyPeriod
            )
          )
        : null,
      machineUnderWarranty,
      partUnderWarranty,
    });
  } catch (error) {
    console.error("Error checking warranty status:", error);
    res.status(500).json({
      success: false,
      message: "Error checking warranty status",
      error: error.message,
    });
  }
};

// Fetch parts by machine name
exports.getPartsByMachineName = async (req, res) => {
  try {
    const { machineName } = req.params;

    if (!machineName) {
      return res.status(400).json({
        success: false,
        message: "Machine name is required",
      });
    }

    // Find parts with the given machine name (case-insensitive)
    const parts = await MachinePart.find({
      machineName: { $regex: `^${machineName}$`, $options: "i" },
    }).select("machinepartName machinepartId machineName _id");

    res.status(200).json({
      success: true,
      data: parts,
    });
  } catch (error) {
    console.error("Error fetching parts by machine name:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching parts by machine name",
      error: error.message,
    });
  }
};
