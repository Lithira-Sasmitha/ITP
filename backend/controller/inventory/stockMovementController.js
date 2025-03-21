const StockMovement = require('../../models/inventoryModel/stockMovementModel');
const RawMaterial = require('../../models/inventoryModel/rawMaterialModel');
const PackingMaterial = require('../../models/inventoryModel/packingMaterialModel');
const FinalProduct = require('../../models/inventoryModel/finalProductModel');

exports.getStockMovement = async (req, res) => {
  try {
    const movements = await StockMovement.find().sort({ date: -1 })
      .populate('productId', 'name'); // Populate product name

    // Map data to return in the desired format
    const formattedMovements = movements.map(movement => ({
      productName: movement.productId.name,
      productType: movement.productType,
      quantity: movement.quantity,
      location: movement.location,
      date: movement.date,
      type: movement.type,
    }));

    res.status(200).json(formattedMovements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new stock movement (In/Out)
exports.createStockMovement = async (req, res) => {
  const { productId, quantity, location, productType } = req.body;

  // Check if the product is a raw material
  let product;
  if (productType === 'RawMaterial') {
    product = await RawMaterial.findById(productId);
  } 
  // Check if the product is a packing material
  else if (productType === 'PackingMaterial') {
    product = await PackingMaterial.findById(productId);
  }
  // Check if the product is a final product
  else if (productType === 'FinalProduct') {
    product = await FinalProduct.findById(productId);
  }

  // Validate that the product exists
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  // Determine stock movement type (In/Out) based on quantity
  let type;
  if (quantity > 0) {
    type = 'In'; // Stock added
    product.quantity += quantity;  // Increase the stock quantity
  } else if (quantity < 0) {
    type = 'Out'; // Stock removed
    if (product.quantity + quantity < 0) {
      return res.status(400).json({ message: 'Insufficient stock for Out movement' });
    }
    product.quantity += quantity;  // Decrease the stock quantity
  }

  // Save the updated product data
  await product.save();

  // Create the stock movement entry
  const newMovement = new StockMovement({
    productId, 
    quantity: Math.abs(quantity), // Use absolute value for quantity
    type,  // Set 'In' or 'Out' based on quantity
    location,
    productType,
  });

  try {
    const savedMovement = await newMovement.save();
    res.status(201).json(savedMovement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
