const express = require("express");
const router = express.Router();
const {
  createOrder,
  getPendingOrders,
  updateOrderStatus,
  getOrderById,
} = require("../controller/order/OrderController");

// Create a new order
router.post("/", createOrder);

// Get all pending orders
router.get("/pending", getPendingOrders);

// Get a specific order
router.get("/:orderId", getOrderById);

// Update order status
router.patch("/:orderId/status", updateOrderStatus);

module.exports = router;
