const mongoose = require("mongoose");
const Order = require("../../models/orderModel/Order");
const FinalProduct = require("../../models/inventoryModel/finalProductModel");
const StockMovement = require("../../models/inventoryModel/stockMovementModel");

// Create a new order
const createOrder = async (req, res) => {
  try {
    const {
      name,
      address,
      phone,
      postalCode,
      cartItems,
      deliveryPrice,
      total,
    } = req.body;

    // Validate cart items
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Transform cart items to the required format
    const products = cartItems.map((item) => ({
      productName: item.name,
      quantity: item.quantity,
      price: item.price,
    }));

    // Check inventory and update quantities
    for (const item of cartItems) {
      const product = await FinalProduct.findOne({ name: item.name });
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product ${item.name} not found` });
      }
      if (product.quantity < item.quantity) {
        return res
          .status(400)
          .json({ message: `Insufficient stock for ${item.name}` });
      }

      // Decrease the product quantity
      product.quantity -= item.quantity;
      // Update status based on new quantity
      if (product.quantity === 0) {
        product.status = "Out of Stock";
      } else if (product.quantity <= product.reorder_level) {
        product.status = "Low";
      } else {
        product.status = "In Stock";
      }
      await product.save();

      // Create OUT stock movement
      const stockMovement = new StockMovement({
        productType: "Final",
        productTypeRef: "FinalProduct",
        productId: product._id,
        productName: product.name,
        movementType: "OUT",
        quantity: item.quantity,
      });
      await stockMovement.save();
    }

    // Create the order
    const newOrder = new Order({
      name,
      address,
      phone,
      postalCode,
      products,
      deliveryPrice,
      totalPrice: total,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res
      .status(500)
      .json({ message: "Failed to create order", error: error.message });
  }
};

// Get all pending orders
const getPendingOrders = async (req, res) => {
  try {
    const pendingOrders = await Order.find({ status: "pending" });
    res.status(200).json(pendingOrders);
  } catch (error) {
    console.error("Error fetching pending orders:", error);
    res.status(500).json({
      message: "Failed to fetch pending orders",
      error: error.message,
    });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating order status:", error);
    res
      .status(500)
      .json({ message: "Failed to update order status", error: error.message });
  }
};

// Get a specific order
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch order", error: error.message });
  }
};

// Delete an order
const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Validate ObjectId
    if (!mongoose.isValidObjectId(orderId)) {
      console.error(`Invalid ObjectId provided: ${orderId}`);
      return res.status(400).json({ message: "Invalid order ID format" });
    }

    console.log(`Attempting to delete order: ${orderId}`); // Debug log
    const order = await Order.findByIdAndDelete(orderId);

    if (!order) {
      console.error(`Order not found: ${orderId}`);
      return res.status(404).json({ message: "Order not found" });
    }

    console.log(`Order deleted successfully: ${orderId}`);
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", {
      message: error.message,
      stack: error.stack,
    });
    res
      .status(500)
      .json({ message: "Failed to delete order", error: error.message });
  }
};

module.exports = {
  createOrder,
  getPendingOrders,
  updateOrderStatus,
  getOrderById,
  deleteOrder,
};
