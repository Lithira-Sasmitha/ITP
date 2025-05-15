const Machine = require("../../models/machineModel/Machine");
const MachinePart = require("../../models/machineModel/MachinePart");
const MaintenanceInquiry = require("../../models/machineModel/MaintenanceInquiry");

// Check warranty status for machine and part
exports.checkWarranty = async (req, res) => {
  try {
    const { machineId, partId } = req.params;

    const machine = await Machine.findById(machineId);
    if (!machine) {
      return res
        .status(404)
        .json({ success: false, message: "Machine not found" });
    }

    const part = await MachinePart.findById(partId);
    if (!part) {
      return res
        .status(404)
        .json({ success: false, message: "Part not found" });
    }

    const currentDate = new Date();

    // Check machine warranty
    const machineUnderWarranty =
      machine.warrantyDate && currentDate <= new Date(machine.warrantyDate);

    // Check part warranty
    let partUnderWarranty = false;
    if (part.machinepartPurchaseDate && part.machinepartWarrantyPeriod) {
      const purchaseDate = new Date(part.machinepartPurchaseDate);
      const warrantyEndDate = new Date(
        purchaseDate.setMonth(
          purchaseDate.getMonth() + part.machinepartWarrantyPeriod
        )
      );
      partUnderWarranty = currentDate <= warrantyEndDate;
    }

    const isUnderWarranty = machineUnderWarranty && partUnderWarranty;

    res.status(200).json({
      success: true,
      machineUnderWarranty,
      partUnderWarranty,
      isUnderWarranty,
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

// Create a new maintenance inquiry
exports.createMaintenanceInquiry = async (req, res) => {
  try {
    const { machineId, partId, issue, isUnderWarranty } = req.body;

    if (!machineId || !partId || !issue || isUnderWarranty === undefined) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const machine = await Machine.findById(machineId);
    if (!machine) {
      return res
        .status(404)
        .json({ success: false, message: "Machine not found" });
    }

    const part = await MachinePart.findById(partId);
    if (!part) {
      return res
        .status(404)
        .json({ success: false, message: "Part not found" });
    }

    // Check for existing inquiries with the same machine and issue
    const existingInquiry = await MaintenanceInquiry.findOne({
      machineId,
      issue,
      status: { $ne: "complete" }, // Only check for non-completed statuses
    });

    if (existingInquiry) {
      return res.status(400).json({
        success: false,
        message:
          "An active maintenance inquiry for this machine and issue already exists. Please wait until it is completed.",
      });
    }

    const maintenanceInquiry = new MaintenanceInquiry({
      machineId,
      partId,
      issue,
      isUnderWarranty,
    });

    const savedInquiry = await maintenanceInquiry.save();

    res.status(201).json({
      success: true,
      message: "Maintenance inquiry created successfully",
      data: savedInquiry,
    });
  } catch (error) {
    console.error("Error creating maintenance inquiry:", error);
    res.status(500).json({
      success: false,
      message: "Error creating maintenance inquiry",
      error: error.message,
    });
  }
};

// Get all maintenance inquiries
exports.getAllMaintenanceInquiries = async (req, res) => {
  try {
    const inquiries = await MaintenanceInquiry.find()
      .populate("machineId", "name id")
      .populate("partId", "machinepartName machinepartId")
      .sort({ dateSubmitted: -1 });

    res.status(200).json({
      success: true,
      data: inquiries,
    });
  } catch (error) {
    console.error("Error fetching maintenance inquiries:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching maintenance inquiries",
      error: error.message,
    });
  }
};

// Update maintenance inquiry status
exports.updateMaintenanceInquiry = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!status) {
      return res
        .status(400)
        .json({ success: false, message: "Status is required" });
    }

    const inquiry = await MaintenanceInquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!inquiry) {
      return res
        .status(404)
        .json({ success: false, message: "Maintenance inquiry not found" });
    }

    res.status(200).json({
      success: true,
      message: "Maintenance inquiry updated successfully",
      data: inquiry,
    });
  } catch (error) {
    console.error("Error updating maintenance inquiry:", error);
    res.status(500).json({
      success: false,
      message: "Error updating maintenance inquiry",
      error: error.message,
    });
  }
};

// Delete maintenance inquiry
exports.deleteMaintenanceInquiry = async (req, res) => {
  try {
    const { id } = req.params;

    const inquiry = await MaintenanceInquiry.findByIdAndDelete(id);
    if (!inquiry) {
      return res
        .status(404)
        .json({ success: false, message: "Maintenance inquiry not found" });
    }

    res.status(200).json({
      success: true,
      message: "Maintenance inquiry deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting maintenance inquiry:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting maintenance inquiry",
      error: error.message,
    });
  }
};
