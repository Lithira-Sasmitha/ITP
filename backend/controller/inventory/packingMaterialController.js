const PackingMaterial = require("../../models/inventoryModel/packingMaterialModel");
const StockMovement = require("../../models/inventoryModel/stockMovementModel");

// Create a new Packing material
exports.createPackingMaterial = async (req, res) => {
  try {
    const {
      name, quantity, unit, reorder_level, unit_price,
      supplier_name, supplier_email, supplier_phone,
      location, received_date, expiry_date, status
    } = req.body;

    // 🔍 Check if material with the same name already exists
    const existingMaterial = await PackingMaterial.findOne({ name: name.trim() });
    if (existingMaterial) {
      return res.status(400).json({ message: "Material already exists. Please update it instead." });
    }

    // ✅ Create new material
    const newMaterial = new PackingMaterial({
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
    console.error('Error creating packing material:', error);
    res.status(500).json({ error: error.message });
  }
};


// Get all Packing materials
exports.getPackingMaterials = async (req, res) => {
  try {
    const materials = await PackingMaterial.find().sort({ lastUpdated: -1 });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single Packing material by ID
exports.getPackingMaterialById = async (req, res) => {
  try {
    const material = await PackingMaterial.findById(req.params.id);
    if (!material) return res.status(404).json({ message: "Not found" });
    res.json(material);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Packing material details
exports.updatePackingMaterial = async (req, res) => {
  try {
    const { name, quantity, unit, reorder_level, unit_price, supplier_name, supplier_email, supplier_phone, location, received_date, expiry_date, status } = req.body;

    const existingMaterial = await PackingMaterial.findById(req.params.id);
    if (!existingMaterial) return res.status(404).json({ message: "Not found" });

    const quantityDifference = quantity - existingMaterial.quantity;

    const updatedMaterial = await PackingMaterial.findByIdAndUpdate(
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
        productType: 'Packing',
        productTypeRef: 'PackingMaterial',
        productId: updatedMaterial._id,
        productName: updatedMaterial.name,
        movementType: movementType,
        quantity: movementQuantity,
      });
      await stockMovement.save();
    }

    res.json(updatedMaterial);
  } catch (error) {
    console.error('Error updating packing material:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete Packing material
exports.deletePackingMaterial = async (req, res) => {
  try {
    const deletedMaterial = await PackingMaterial.findByIdAndDelete(req.params.id);
    if (!deletedMaterial) return res.status(404).json({ message: "Not found" });

    // ➡️ After deleting, create OUT stock movement (full quantity OUT)
    const stockMovement = new StockMovement({
      productType: 'Packing',
      productTypeRef: 'PackingMaterial',
      productId: deletedMaterial._id,
      productName: deletedMaterial.name,
      movementType: 'OUT',
      quantity: deletedMaterial.quantity,
    });
    await stockMovement.save();

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error('Error deleting packing material:', error);
    res.status(500).json({ error: error.message });
  }
};