const express = require("express");
const {
  createMachine,
  getAllMachines,
  getMachineById,
  updateMachine,
  deleteMachine,
} = require("../controller/machine/MachineController");

const router = express.Router();

router.post("/", createMachine);
router.get("/", getAllMachines);
router.get("/:id", getMachineById);
router.put("/:id", updateMachine);
router.delete("/:id", deleteMachine);

module.exports = router;