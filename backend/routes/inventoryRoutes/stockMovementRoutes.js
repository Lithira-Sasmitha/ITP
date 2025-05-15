const express = require("express");
const router = express.Router();
const {
  getAllStockMovements,
  getStockMovementsByProductId,
  deleteStockMovement,
} = require("../../controller/inventory/stockMovementController");

router.get("/", getAllStockMovements); // get all movements
router.get("/:id", getStockMovementsByProductId); // get movements by product id
router.delete("/deleteStockMovement/:id", deleteStockMovement); 
module.exports = router;