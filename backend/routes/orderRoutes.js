const express = require("express");
const router = express.Router();
const {
  createOrder,
  getPendingOrders,
  updateOrderStatus,
  getOrderById,
  deleteOrder,
} = require("../controller/order/OrderController");

// Create a new order
router.post("/", createOrder);

// Get all pending orders
router.get("/pending", getPendingOrders);

// Get a specific order
router.get("/:orderId", getOrderById);

// Update order status
router.patch("/:orderId/status", updateOrderStatus);

// Delete an order
router.delete("/:orderId", deleteOrder);

module.exports = router;
