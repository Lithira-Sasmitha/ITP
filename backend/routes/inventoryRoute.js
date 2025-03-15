const express = require("express");
const router = express.Router();
const {
  createRawMaterial,
  getRawMaterials,
  getRawMaterialById,
  updateRawMaterial,
  deleteRawMaterial,
} = require("../controllers/rawMaterialController");

router.post("/", createRawMaterial);
router.get("/", getRawMaterials);
router.get("/:id", getRawMaterialById);
router.put("/:id", updateRawMaterial);
router.delete("/:id", deleteRawMaterial);

module.exports = router;
