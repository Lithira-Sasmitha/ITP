const express = require("express");
const {
  checkWarranty,
  createMaintenanceInquiry,
  getAllMaintenanceInquiries,
  updateMaintenanceInquiry,
  deleteMaintenanceInquiry,
} = require("../controller/machine/MaintenanceController");

const router = express.Router();

router.get("/check-warranty/:machineId/:partId", checkWarranty);
router.post("/", createMaintenanceInquiry);
router.get("/", getAllMaintenanceInquiries);
router.put("/:id", updateMaintenanceInquiry);
router.delete("/:id", deleteMaintenanceInquiry);

module.exports = router;
