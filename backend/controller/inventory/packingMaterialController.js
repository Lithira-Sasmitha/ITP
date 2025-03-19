const PackingMaterial = require("../../models/inventoryModel/packingMaterialModel");

// Create a new Packing material
exports.createPackingMaterial = async (req, res) => {
  try {
    const { id, name, quantity, unit, reorder_level, unit_price, supplier_name, supplier_email, supplier_phone, location, received_date, expiry_date, status } = req.body;
    const newMaterial = new PackingMaterial({id, name, quantity, unit, reorder_level, unit_price, supplier_name, supplier_email, supplier_phone, location, received_date, expiry_date, status });
    await newMaterial.save();
    res.status(201).json(newMaterial);
  } catch (error) {
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
    const { id, name, quantity, unit, reorder_level, unit_price, supplier_name, supplier_email, supplier_phone, location, received_date, expiry_date, status } = req.body;
    const updatedMaterial = await PackingMaterial.findByIdAndUpdate(
      req.params.id,
      { name, quantity, unit, reorder_level, unit_price, supplier_name, supplier_email, supplier_phone, location, received_date, expiry_date, status, lastUpdated: Date.now() },
      { new: true }
    );
    if (!updatedMaterial) return res.status(404).json({ message: "Not found" });
    res.json(updatedMaterial);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Packing material
exports.deletePackingMaterial = async (req, res) => {
  try {
    const deletedMaterial = await PackingMaterial.findByIdAndDelete(req.params.id);
    if (!deletedMaterial) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
