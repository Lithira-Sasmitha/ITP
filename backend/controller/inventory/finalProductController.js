const FinalProduct = require("../../models/inventoryModel/finalProductModel");
const StockMovement = require("../../models/inventoryModel/stockMovementModel");

// Create a new final product
exports.createFinalProduct = async (req, res) => {
  try {
    const { name, quantity, unit, reorder_level, unit_price, location, received_date, expiry_date, status } = req.body;

    const existingMaterial = await FinalProduct.findOne({ name: name.trim() });
        if (existingMaterial) {
          return res.status(400).json({ message: "Product already exists. Please update it instead." });
        }
    
    const newProduct = new FinalProduct({
      name, quantity, unit, reorder_level, unit_price, location, received_date, expiry_date, status
    });

    await newProduct.save();

    // ➡️ After saving, create IN stock movement
    const newStockMovement = new StockMovement({
      productType: 'Final',
      productTypeRef: 'FinalProduct',
      productId: newProduct._id,
      productName: newProduct.name,
      movementType: 'IN',
      quantity: quantity,
    });
    await newStockMovement.save();

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating final product:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get all Final products
exports.getFinalProduct = async (req, res) => {
  try {
    const products = await FinalProduct.find().sort({ updatedAt: -1 });
    res.json(products);
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
    const { name, quantity, unit, reorder_level, unit_price, location, received_date, expiry_date, status } = req.body;

    const existingProduct = await FinalProduct.findById(req.params.id);
    if (!existingProduct) return res.status(404).json({ message: "Not found" });

    const quantityDifference = quantity - existingProduct.quantity;

    const updatedProduct = await FinalProduct.findByIdAndUpdate(
      req.params.id,
      {
        name, quantity, unit, reorder_level, unit_price, location, received_date, expiry_date, status, updatedAt: Date.now()
      },
      { new: true }
    );

    // ➡️ After updating, create IN/OUT stock movement if quantity changed
    if (quantityDifference !== 0) {
      const movementType = quantityDifference > 0 ? 'IN' : 'OUT';
      const movementQuantity = Math.abs(quantityDifference);

      const stockMovement = new StockMovement({
        productType: 'Final',
        productTypeRef: 'FinalProduct',
        productId: updatedProduct._id,
        productName: updatedProduct.name,
        movementType: movementType,
        quantity: movementQuantity,
      });
      await stockMovement.save();
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating final product:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete Final Product
exports.deleteFinalProduct = async (req, res) => {
  try {
    const deletedProduct = await FinalProduct.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: "Not found" });

    // ➡️ After deleting, create OUT stock movement (full quantity OUT)
    const stockMovement = new StockMovement({
      productType: 'Final',
      productTypeRef: 'FinalProduct',
      productId: deletedProduct._id,
      productName: deletedProduct.name,
      movementType: 'OUT',
      quantity: deletedProduct.quantity,
    });
    await stockMovement.save();

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error('Error deleting final product:', error);
    res.status(500).json({ error: error.message });
  }
};