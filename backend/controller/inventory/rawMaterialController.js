const RawMaterial = require("../../models/inventoryModel/rawMaterialModel");

// Create a new raw material
exports.createRawMaterial = async (req, res) => {
  try {
    const { id, name, quantity, unit, reorder_level, unit_price, supplier_name, supplier_email, supplier_phone, location, received_date, expiry_date, status } = req.body;
    const newMaterial = new RawMaterial({id, name, quantity, unit, reorder_level, unit_price, supplier_name, supplier_email, supplier_phone, location, received_date, expiry_date, status });
    await newMaterial.save();
    res.status(201).json(newMaterial);
  } catch (error) {
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
    const { id, name, quantity, unit, reorder_level, unit_price, supplier_name, supplier_email, supplier_phone, location, received_date, expiry_date, status } = req.body;
    const updatedMaterial = await RawMaterial.findByIdAndUpdate(
      req.params.id,
      {  name, quantity, unit, reorder_level, unit_price, supplier_name, supplier_email, supplier_phone, location, received_date, expiry_date, status, lastUpdated: Date.now() },
      { new: true }
    );
    if (!updatedMaterial) return res.status(404).json({ message: "Not found" });
    res.json(updatedMaterial);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete raw material
exports.deleteRawMaterial = async (req, res) => {
  try {
    const deletedMaterial = await RawMaterial.findByIdAndDelete(req.params.id);
    if (!deletedMaterial) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
