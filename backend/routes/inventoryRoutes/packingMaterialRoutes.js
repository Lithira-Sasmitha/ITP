const express = require("express");
const router = express.Router();
const {
  createPackingMaterial,
  getPackingMaterials,
  getPackingMaterialById,
  updatePackingMaterial,
  deletePackingMaterial,
} = require("../../controller/inventory/packingMaterialController");

router.post("/createPackingMaterial", createPackingMaterial);
router.get("/", getPackingMaterials);
router.get("/:id", getPackingMaterialById);
router.put("/updatePackingMaterial/:id",  updatePackingMaterial);
router.delete("/deletePackingMaterial/:id", deletePackingMaterial);

module.exports = router;