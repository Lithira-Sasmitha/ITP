const express = require("express");
const {
  createMachine,
  getAllMachines,
  getMachineById,
  updateMachine,
  deleteMachine,
} = require("../controller/machine/MachineController");
const Machine = require("../models/machineModel/Machine");
const MaintenanceRequest = require("../models/machineModel/MaintenanceInquiry");

const router = express.Router();

router.post("/", createMachine);
router.get("/", getAllMachines);
router.get("/:id", getMachineById);
router.put("/:id", updateMachine);
router.delete("/:id", deleteMachine);

// Get all machines
router.get("/", async (req, res) => {
  try {
    const machines = await Machine.find();
    res.status(200).json({
      success: true,
      data: machines,
    });
  } catch (error) {
    console.error("Error fetching machines:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching machines",
    });
  }
});

// Get parts for a specific machine
router.get("/:machineId/parts", async (req, res) => {
  try {
    const { machineId } = req.params;
    const machine = await Machine.findOne({ machineId });

    if (!machine) {
      return res.status(404).json({
        success: false,
        message: "Machine not found",
      });
    }

    res.status(200).json({
      success: true,
      data: machine.parts,
    });
  } catch (error) {
    console.error("Error fetching parts:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching parts",
    });
  }
});

// Check machine and part warranty status
router.get("/check-warranty/:machineId/:partId", async (req, res) => {
  try {
    const { machineId, partId } = req.params;

    // Find the machine in the database
    const machine = await Machine.findOne({ machineId });

    if (!machine) {
      return res.status(404).json({
        success: false,
        message: "Machine not found",
      });
    }

    // Find the part in the machine's parts array
    const part = machine.parts.find((p) => p.partId === partId);

    if (!part) {
      return res.status(404).json({
        success: false,
        message: "Part not found for this machine",
      });
    }

    // Check if machine and part are under warranty
    const currentDate = new Date();
    const machineUnderWarranty =
      machine.warrantyEndDate &&
      currentDate <= new Date(machine.warrantyEndDate);
    const partUnderWarranty =
      part.warrantyEndDate && currentDate <= new Date(part.warrantyEndDate);

    res.status(200).json({
      success: true,
      isUnderWarranty: machineUnderWarranty && partUnderWarranty,
      machineWarrantyEndDate: machine.warrantyEndDate,
      partWarrantyEndDate: part.warrantyEndDate,
      machineUnderWarranty,
      partUnderWarranty,
    });
  } catch (error) {
    console.error("Error checking warranty status:", error);
    res.status(500).json({
      success: false,
      message: "Error checking warranty status",
    });
  }
});

// Update maintenance status
router.put(
  "/update-maintenance-status/:machineId/:partId",
  async (req, res) => {
    try {
      const { machineId, partId } = req.params;
      const { status } = req.body;

      // Find the machine in the database
      const machine = await Machine.findOne({ machineId });

      if (!machine) {
        return res.status(404).json({
          success: false,
          message: "Machine not found",
        });
      }

      // Find the part in the machine's parts array
      const part = machine.parts.find((p) => p.partId === partId);

      if (!part) {
        return res.status(404).json({
          success: false,
          message: "Part not found for this machine",
        });
      }

      // Update the maintenance status
      part.maintenanceStatus = status;
      part.lastUpdated = new Date();

      // Save the changes
      await machine.save();

      res.status(200).json({
        success: true,
        message: "Maintenance status updated successfully",
        updatedPart: part,
      });
    } catch (error) {
      console.error("Error updating maintenance status:", error);
      res.status(500).json({
        success: false,
        message: "Error updating maintenance status",
      });
    }
  }
);

// Create maintenance request
router.post("/maintenance-request", async (req, res) => {
  try {
    console.log("Received maintenance request:", req.body);

    const { machineName, machineId, partName, partId, issue, isUnderWarranty } =
      req.body;

    // Validate required fields
    if (!machineName || !machineId || !partName || !partId || !issue) {
      console.log("Missing required fields");
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const maintenanceRequest = new MaintenanceRequest({
      machineName,
      machineId,
      partName,
      partId,
      issue,
      isUnderWarranty,
    });

    console.log("Creating maintenance request:", maintenanceRequest);

    const savedRequest = await maintenanceRequest.save();
    console.log("Maintenance request saved:", savedRequest);

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
});

// Get all maintenance requests
router.get("/maintenance-requests", async (req, res) => {
  try {
    const maintenanceRequests = await MaintenanceRequest.find().sort({
      dateSubmitted: -1,
    });

    res.status(200).json({
      success: true,
      data: maintenanceRequests,
    });
  } catch (error) {
    console.error("Error fetching maintenance requests:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching maintenance requests",
    });
  }
});

// Delete maintenance request
router.delete("/maintenance-request/:id", async (req, res) => {
  try {
    const { id } = req.params;

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
    });
  }
});

module.exports = router;
