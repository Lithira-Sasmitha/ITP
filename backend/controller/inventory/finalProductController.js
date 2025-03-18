const FinalProduct = require("../../models/inventoryModel/finalProductModel");

// Create a new final product
exports.createFinalProduct = async (req, res) => {
  try {
    const { id, name, quantity, unit, reorder_level, unit_price, location, received_date, expiry_date, status } = req.body;
    const newProduct = new FinalProduct({id, name, quantity, unit, reorder_level, unit_price, location, received_date, expiry_date, status });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

 
// Get all Final product
exports.getFinalProduct = async (req, res) => {
  try {
    const Product = await FinalProduct.find().sort({ lastUpdated: -1 });
    res.json(Product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single Final product by ID
exports.getFinalProductById = async (req, res) => {
  try {
    const product = await FinalProduct.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Final product details
exports.updateFinalProduct = async (req, res) => {
  try {
    const { id, name, quantity, unit, reorder_level, unit_price, supplier_name, supplier_email, supplier_phone, location, received_date, expiry_date, status } = req.body;
    const updatedProduct = await FinalProduct.findByIdAndUpdate(
      req.params.id,
      { name, quantity, unit, lastUpdated: Date.now() },
      { new: true }
    );
    if (!updatedProduct) return res.status(404).json({ message: "Not found" });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Final Products
exports.deleteFinalProduct = async (req, res) => {
  try {
    const deletedProduct = await FinalProduct.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
