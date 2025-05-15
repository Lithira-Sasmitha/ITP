// models/deliveryModel.js
const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    telephone: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    oneItemPrice: {
      type: String,
      required: true,
    },
    itemsPrice: {
      type: String,
      required: true,
    },
    deliveryPrice: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: String,
      required: true,
    },
    orderDate: {
      type: String,
      required: true,
    },
    confirmOrderDate: {
      type: String,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Success", "Failed", "Canceled"],
      default: "Success",
    },
    deliveryStatus: {
      type: String,
      enum: ["Pending", "Delayed", "Completed"],
      default: "Pending",
    },
    assignedDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      default: null
    },
    driverAssignmentDate: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
  }
);

const Delivery = mongoose.model("Delivery", deliverySchema);

module.exports = Delivery;
