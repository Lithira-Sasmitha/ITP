const StockMovement = require("../../models/inventoryModel/stockMovementModel");

// Get all Stock Movements
exports.getAllStockMovements = async (req, res) => {
  try {
    const stockMovements = await StockMovement.find()
      .sort({ createdAt: -1 })
      .populate('productId', 'name'); // dynamic based on refPath
    res.json(stockMovements);
  } catch (error) {
    console.error("Error fetching stock movements:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get Stock Movements by Product ID
exports.getStockMovementsByProductId = async (req, res) => {
  try {
    const stockMovements = await StockMovement.find({ productId: req.params.id })
      .sort({ createdAt: -1 });
    if (!stockMovements.length) {
      return res.status(404).json({ error: "No stock movements found for this product" });
    }
    res.json(stockMovements);
  } catch (error) {
    console.error("Error fetching stock movements by product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a stock movement
exports.deleteStockMovement = async (req, res) => {
  try {
    const movement = await StockMovement.findByIdAndDelete(req.params.id);
    if (!movement) {
      return res.status(404).json({ message: 'Stock Movement not found' });
    }
    res.json({ message: 'Stock Movement deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
