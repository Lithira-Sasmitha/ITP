const express = require("express");
const router = express.Router();
const {
  createPackingMaterial,
  getPackingMaterials,
  getPackingMaterialById,
  updatePackingMaterial,
  deletePackingMaterial,
} = require("../../controller/inventory/packingMaterialController");

router.post("/", createPackingMaterial);
router.get("/", getPackingMaterials);
router.get("/:id", getPackingMaterialById);
router.put("/:id",  updatePackingMaterial);
router.delete("/:id", deletePackingMaterial);

module.exports = router;
