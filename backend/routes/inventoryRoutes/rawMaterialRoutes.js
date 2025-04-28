const express = require("express");
const router = express.Router();
const {
  createRawMaterial,
  getRawMaterials,
  getRawMaterialById,
  updateRawMaterial,
  deleteRawMaterial,
} = require("../../controller/inventory/rawMaterialController");

router.post("/createRawMaterial", createRawMaterial);
router.get("/", getRawMaterials);
router.get("/:id", getRawMaterialById);
router.put("/updateRawMaterial/:id", updateRawMaterial);
router.delete("/deleteRawMaterial/:id", deleteRawMaterial);

module.exports = router;