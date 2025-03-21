const express = require('express');
const router = express.Router();
const stockMovementController = require('../../controllers/inventoryControllers/stockMovementController');

// Get all stock movements
router.get('/', stockMovementController.getStockMovement);

// Create a new stock movement
router.post('/', stockMovementController.createStockMovement);

module.exports = router;
