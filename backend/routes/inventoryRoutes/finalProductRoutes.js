const express = require("express");
const router = express.Router();
const {
  createFinalProduct,
  getFinalProduct,
  getFinalProductById,
  updateFinalProduct,
  deleteFinalProduct,
} = require("../../controller/inventory/finalProductController");

router.post("/createFinalProduct", createFinalProduct);
router.get("/", getFinalProduct);
router.get("/:id", getFinalProductById);
router.put("/updateFinalProduct/:id", updateFinalProduct);
router.delete("/deleteFinalProduct/:id", deleteFinalProduct);

module.exports = router;