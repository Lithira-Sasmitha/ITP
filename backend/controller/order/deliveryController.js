// controllers/deliveryController.js
const Delivery = require("../../models/orderModel/deliveryModel");
 

// Get all deliveries
exports.getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find().sort({ createdAt: -1 });
    res.status(200).json(deliveries);
  } catch (error) {
    console.error('Error fetching deliveries:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a single delivery by ID
exports.getDeliveryById = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }
    
    res.status(200).json(delivery);
  } catch (error) {
    console.error('Error fetching delivery:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new delivery
exports.createDelivery = async (req, res) => {
  try {
    const newDelivery = new Delivery(req.body);
    const savedDelivery = await newDelivery.save();
    res.status(201).json(savedDelivery);
  } catch (error) {
    console.error('Error creating delivery:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update delivery status
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { deliveryStatus } = req.body;
    
    if (!deliveryStatus) {
      return res.status(400).json({ message: 'Delivery status is required' });
    }
    
    const updatedDelivery = await Delivery.findByIdAndUpdate(
      req.params.id,
      { deliveryStatus },
      { new: true }
    );
    
    if (!updatedDelivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }
    
    res.status(200).json(updatedDelivery);
  } catch (error) {
    console.error('Error updating delivery status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a delivery
exports.deleteDelivery = async (req, res) => {
  try {
    const deletedDelivery = await Delivery.findByIdAndDelete(req.params.id);
    
    if (!deletedDelivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }
    
    res.status(200).json({ message: 'Delivery deleted successfully' });
  } catch (error) {
    console.error('Error deleting delivery:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};