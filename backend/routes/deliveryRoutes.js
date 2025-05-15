// routes/deliveryRoutes.js
const express = require("express");
const router = express.Router();
const deliveryController = require("../controller/order/deliveryController");
// GET all deliveries
router.get("/", deliveryController.getAllDeliveries);

// POST create new delivery
router.post("/", deliveryController.createDelivery);

// GET a specific delivery
router.get("/:id", deliveryController.getDeliveryById);

// PUT update delivery status
router.put("/status", deliveryController.updateDeliveryStatus);

// DELETE a delivery
router.delete("/:id", deliveryController.deleteDelivery);

module.exports = router;
