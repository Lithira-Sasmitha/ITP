const express = require("express");
const {
  createMachinePart,
  getAllMachineParts,
  getMachinePartById,
  updateMachinePart,
  deleteMachinePart,
} = require("../controller/machine/MachinePartController");

const router = express.Router();

router.post("/", createMachinePart);
router.get("/", getAllMachineParts);
router.get("/:id", getMachinePartById);
router.put("/:id", updateMachinePart);
router.delete("/:id", deleteMachinePart);

module.exports = router;
