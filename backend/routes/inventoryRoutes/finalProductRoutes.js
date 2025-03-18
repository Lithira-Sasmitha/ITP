const express = require("express");
const router = express.Router();
const {
  createFinalProduct,
  getFinalProduct,
  getFinalProductById,
  updateFinalProduct,
  deleteFinalProduct,
} = require("../../controller/inventory/finalProductController");

router.post("/", createFinalProduct);
router.get("/", getFinalProduct);
router.get("/:id", getFinalProductById);
router.put("/:id", updateFinalProduct);
router.delete("/:id", deleteFinalProduct);

module.exports = router;
