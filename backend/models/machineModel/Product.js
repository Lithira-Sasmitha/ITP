const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: [true, "Product name is required"] },
    productPrice: { type: String, required: [true, "Product price is required"] },
    productDescription: { type: String, required: [true, "Product description is required"] },
    productImage: { type: String, default: "" },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;