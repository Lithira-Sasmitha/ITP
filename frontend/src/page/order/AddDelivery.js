import { useState } from "react";

const AddDelivery = () => {
  // State to store order details
  const [orderDetails, setOrderDetails] = useState({
    customerName: "",
    orderId: "",
    itemsPrice: "",
  });

  // State to store delivery details (which will be auto-filled)
  const [deliveryDetails, setDeliveryDetails] = useState({
    firstName: "",
    lastName: "",
    telephone: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    items: "",
  });

  // Handle "Add Order" form submission
  const handleAddOrder = (e) => {
    e.preventDefault();

    // Auto-fill the delivery fields based on order details
    setDeliveryDetails((prevState) => ({
      ...prevState,
      firstName: orderDetails.customerName.split(" ")[0], // Assume first name is the first word of customer name
      lastName: orderDetails.customerName.split(" ")[1] || "", // Assume last name is the second word
      items: orderDetails.itemsPrice, // You can modify this to match actual items
    }));
  };

  // Handle "Add Order" input changes
  const handleOrderChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle "Delivery" input changes
  const handleDeliveryChange = (e) => {
    const { name, value } = e.target;
    setDeliveryDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Sidebar - Add Order */}
      <div className="w-1/2 p-4 bg-blue-500 text-white">
        <h2 className="text-2xl mb-4">Add Order</h2>
        <form className="space-y-4" onSubmit={handleAddOrder}>
          <div>
            <label className="block mb-2 text-white">Customer Name</label>
            <input
              type="text"
              className="w-full p-2 border-2 border-gray-300 rounded text-black"
              placeholder="Enter customer name"
              name="customerName"
              value={orderDetails.customerName}
              onChange={handleOrderChange}
            />
          </div>
          <div>
            <label className="block mb-2 text-white">Order ID</label>
            <input
              type="text"
              className="w-full p-2 border-2 border-gray-300 rounded text-black"
              placeholder="Enter order ID"
              name="orderId"
              value={orderDetails.orderId}
              onChange={handleOrderChange}
            />
          </div>
          <div>
            <label className="block mb-2 text-white">Items Price</label>
            <input
              type="text"
              className="w-full p-2 border-2 border-gray-300 rounded text-black"
              placeholder="Enter items price"
              name="itemsPrice"
              value={orderDetails.itemsPrice}
              onChange={handleOrderChange}
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-green-500 text-white rounded"
          >
            Add Order
          </button>
        </form>
      </div>

      {/* Main Content - Delivery Information */}
      <div className="w-1/2 p-6">
        <h2 className="text-2xl mb-4">Delivery Information</h2>
        <form className="space-y-4">
          <div>
            <label className="block mb-2">First Name</label>
            <input
              type="text"
              className="w-full p-2 border-2 border-gray-300 rounded text-black"
              placeholder="Enter first name"
              name="firstName"
              value={deliveryDetails.firstName}
              onChange={handleDeliveryChange}
            />
          </div>
          <div>
            <label className="block mb-2">Last Name</label>
            <input
              type="text"
              className="w-full p-2 border-2 border-gray-300 rounded text-black"
              placeholder="Enter last name"
              name="lastName"
              value={deliveryDetails.lastName}
              onChange={handleDeliveryChange}
            />
          </div>
          <div>
            <label className="block mb-2">Telephone Number</label>
            <input
              type="text"
              className="w-full p-2 border-2 border-gray-300 rounded text-black"
              placeholder="Enter telephone number"
              name="telephone"
              value={deliveryDetails.telephone}
              onChange={handleDeliveryChange}
            />
          </div>
          <div>
            <label className="block mb-2">Address</label>
            <input
              type="text"
              className="w-full p-2 border-2 border-gray-300 rounded text-black"
              placeholder="Enter address"
              name="address"
              value={deliveryDetails.address}
              onChange={handleDeliveryChange}
            />
          </div>
          <div className="flex space-x-4">
            <div>
              <label className="block mb-2">City</label>
              <input
                type="text"
                className="w-full p-2 border-2 border-gray-300 rounded text-black"
                placeholder="Enter city"
                name="city"
                value={deliveryDetails.city}
                onChange={handleDeliveryChange}
              />
            </div>
            <div>
              <label className="block mb-2">Province</label>
              <input
                type="text"
                className="w-full p-2 border-2 border-gray-300 rounded text-black"
                placeholder="Enter province"
                name="province"
                value={deliveryDetails.province}
                onChange={handleDeliveryChange}
              />
            </div>
            <div>
              <label className="block mb-2">Postal Code</label>
              <input
                type="text"
                className="w-full p-2 border-2 border-gray-300 rounded text-black"
                placeholder="Enter postal code"
                name="postalCode"
                value={deliveryDetails.postalCode}
                onChange={handleDeliveryChange}
              />
            </div>
          </div>
          <div>
            <label className="block mb-2">Items</label>
            <input
              type="text"
              className="w-full p-2 border-2 border-gray-300 rounded text-black"
              placeholder="Enter items"
              name="items"
              value={deliveryDetails.items}
              onChange={handleDeliveryChange}
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-green-500 text-white rounded"
          >
            Submit Delivery
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDelivery;
