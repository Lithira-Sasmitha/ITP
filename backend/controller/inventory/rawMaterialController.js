

const RawMaterial = require("../../models/inventoryModel/rawMaterialModel");
const StockMovement = require("../../models/inventoryModel/stockMovementModel");


// Create a new raw material
exports.createRawMaterial = async (req, res) => {
  try {
    const {
      name, quantity, unit, reorder_level, unit_price,
      supplier_name, supplier_email, supplier_phone,
      location, received_date, expiry_date, status
    } = req.body;

    // 🔍 Check if material with the same name already exists
    const existingMaterial = await RawMaterial.findOne({ name: name.trim() });
    if (existingMaterial) {
      return res.status(400).json({ message: "Material already exists. Please update it instead." });
    }

    // ✅ Create new material
    const newMaterial = new RawMaterial({
      name, quantity, unit, reorder_level, unit_price,
      supplier_name, supplier_email, supplier_phone,
      location, received_date, expiry_date, status
    });

    await newMaterial.save();

    // ➕ Record IN stock movement
    const newStockMovement = new StockMovement({
      productType: 'Raw',
      productTypeRef: 'RawMaterial',
      productId: newMaterial._id,
      productName: newMaterial.name,
      movementType: 'IN',
      quantity: quantity,
    });
    await newStockMovement.save();

    res.status(201).json(newMaterial);
  } catch (error) {
    console.error('Error creating raw material:', error);
    res.status(500).json({ error: error.message });
  }
};


// Get all raw materials
exports.getRawMaterials = async (req, res) => {
  try {
    const materials = await RawMaterial.find().sort({ lastUpdated: -1 });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single raw material by ID
exports.getRawMaterialById = async (req, res) => {
  try {
    const material = await RawMaterial.findById(req.params.id);
    if (!material) return res.status(404).json({ message: "Not found" });
    res.json(material);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update raw material details
exports.updateRawMaterial = async (req, res) => {
  try {
    const { name, quantity, unit, reorder_level, unit_price, supplier_name, supplier_email, supplier_phone, location, received_date, expiry_date, status } = req.body;

    const existingMaterial = await RawMaterial.findById(req.params.id);
    if (!existingMaterial) return res.status(404).json({ message: "Not found" });

    const quantityDifference = quantity - existingMaterial.quantity;

    const updatedMaterial = await RawMaterial.findByIdAndUpdate(
      req.params.id,
      {
        name, quantity, unit, reorder_level, unit_price, supplier_name, supplier_email, supplier_phone, location, received_date, expiry_date, status, lastUpdated: Date.now()
      },
      { new: true }
    );

    // ➡️ After updating, create IN/OUT stock movement if quantity changed
    if (quantityDifference !== 0) {
      const movementType = quantityDifference > 0 ? 'IN' : 'OUT';
      const movementQuantity = Math.abs(quantityDifference);

      const stockMovement = new StockMovement({
        productType: 'Raw',
        productTypeRef: 'RawMaterial',
        productId: updatedMaterial._id,
        productName: updatedMaterial.name,
        movementType: movementType,
        quantity: movementQuantity,
      });
      await stockMovement.save();
    }

    res.json(updatedMaterial);
  } catch (error) {
    console.error('Error updating raw material:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete raw material
exports.deleteRawMaterial = async (req, res) => {
  try {
    const deletedMaterial = await RawMaterial.findByIdAndDelete(req.params.id);
    if (!deletedMaterial) return res.status(404).json({ message: "Not found" });

    // ➡️ After deleting, create OUT stock movement (full quantity OUT)
    const stockMovement = new StockMovement({
      productType: 'Raw',
      productTypeRef: 'RawMaterial',
      productId: deletedMaterial._id,
      productName: deletedMaterial.name,
      movementType: 'OUT',
      quantity: deletedMaterial.quantity,
    });
    await stockMovement.save();

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error('Error deleting raw material:', error);
    res.status(500).json({ error: error.message });
  }
};
