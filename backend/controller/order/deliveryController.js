// controllers/deliveryController.js
const Delivery = require("../../models/orderModel/deliveryModel");
const Driver = require("../../models/orderModel/Driver");

// Auto-assign driver to delivery
const autoAssignDriver = async (delivery) => {
  try {
    // Find available drivers (not currently assigned to any pending delivery)
    const availableDrivers = await Driver.find({
      _id: { 
        $nin: await Delivery.distinct('assignedDriver', { 
          deliveryStatus: 'Pending',
          assignedDriver: { $ne: null }
        })
      }
    });

    if (availableDrivers.length === 0) {
      return null; // No available drivers
    }

    // Assign the first available driver
    const assignedDriver = availableDrivers[0];
    delivery.assignedDriver = assignedDriver._id;
    delivery.driverAssignmentDate = new Date();
    await delivery.save();

    return assignedDriver;
  } catch (error) {
    console.error('Error in auto-assigning driver:', error);
    return null;
  }
};

// Get all deliveries
exports.getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find()
      .populate('assignedDriver', 'name telephone vehicle vehicleRegNo')
      .sort({ createdAt: -1 });
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
    
    // Auto-assign driver to the new delivery
    const assignedDriver = await autoAssignDriver(savedDelivery);
    
    if (assignedDriver) {
      res.status(201).json({
        message: 'Delivery created and driver assigned successfully',
        delivery: savedDelivery,
        assignedDriver
      });
    } else {
      res.status(201).json({
        message: 'Delivery created but no available drivers',
        delivery: savedDelivery
      });
    }
  } catch (error) {
    console.error('Error creating delivery:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update delivery status
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { deliveryId, status } = req.body;
    
    if (!deliveryId || !status) {
      return res.status(400).json({ message: 'Delivery ID and status are required' });
    }

    const validStatuses = ["Pending", "Delayed", "Completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updatedDelivery = await Delivery.findByIdAndUpdate(
      deliveryId,
      { 
        deliveryStatus: status,
        ...(status === 'Completed' && { completedAt: new Date() })
      },
      { new: true }
    ).populate('assignedDriver', 'name telephone vehicle vehicleRegNo');

    if (!updatedDelivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    res.status(200).json({
      message: 'Delivery status updated successfully',
      delivery: updatedDelivery
    });
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
    
    res.status(200).json({ 
      message: 'Delivery deleted successfully',
      deletedDelivery 
    });
  } catch (error) {
    console.error('Error deleting delivery:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};