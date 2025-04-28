const express = require("express");
const router = express.Router();
const maintenanceController = require("../controller/machine/MaintenanceController");

// Maintenance inquiry routes
router.post("/", maintenanceController.createMaintenanceInquiry);
router.get("/", maintenanceController.getAllMaintenanceInquiries);
router.delete("/:id", maintenanceController.deleteMaintenanceInquiry);
router.put("/:id", maintenanceController.updateMaintenanceInquiryStatus);
router.get(
  "/check-warranty/:machineId/:partId",
  maintenanceController.checkWarrantyStatus
);
router.get(
  "/parts-by-machine-name/:machineName",
  maintenanceController.getPartsByMachineName
);

module.exports = router;
