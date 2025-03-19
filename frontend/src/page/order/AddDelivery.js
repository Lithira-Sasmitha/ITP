import { useState } from "react";

const AddDelivery = () => {
  // State to store order details
  const [orderDetails, setOrderDetails] = useState({
    orderId: "",
    customerName: "",
    address: "",
    postalCode: "",
    telephone: "",
    quantity: "",
    oneItemPrice: "",
    itemsPrice: "",
    deliveryPrice: "",
    totalPrice: "",
    orderDate: "", // Added order date field
    orderStatus: "Pending",
  });

  // State to store delivery details
  const [deliveryDetails, setDeliveryDetails] = useState({
    orderId: "",
    customerName: "",
    address: "",
    postalCode: "",
    telephone: "",
    quantity: "",
    oneItemPrice: "",
    itemsPrice: "",
    deliveryPrice: "",
    totalPrice: "",
    confirmOrderDate: "", // Added confirm order date field
    orderStatus: "Pending",
  });

  // Handle "Add Order" input changes
  const handleOrderChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails((prevState) => {
      const updatedState = { ...prevState, [name]: value };
      if (name === "quantity" || name === "oneItemPrice") {
        const quantity = parseInt(updatedState.quantity) || 0;
        const oneItemPrice = parseFloat(updatedState.oneItemPrice) || 0;
        updatedState.itemsPrice = (quantity * oneItemPrice).toString();
      }
      const itemsPrice = parseFloat(updatedState.itemsPrice) || 0;
      const deliveryPrice = parseFloat(updatedState.deliveryPrice) || 0;
      updatedState.totalPrice = (itemsPrice + deliveryPrice).toString();
      return updatedState;
    });
  };

  // Handle "Add Order" form submission
  const handleAddOrder = (e) => {
    e.preventDefault();
    const currentDate = new Date().toISOString().split("T")[0]; // Get current date
    setDeliveryDetails({
      ...orderDetails,
      confirmOrderDate: currentDate,
      orderStatus: "Success",
    });
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar - Add Order */}
      <div
        className="w-1/2 p-4 bg-white text-black"
        style={{
          borderRadius: "15px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 className="text-2xl mb-4 font-semibold">Add Order</h2>
        <form className="space-y-4" onSubmit={handleAddOrder}>
          {Object.keys(orderDetails).map((key) => (
            <div key={key}>
              <label className="block mb-2 text-gray-700">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </label>
              <input
                type={key === "orderDate" ? "date" : "text"}
                className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder={`Enter ${key}`}
                name={key}
                value={orderDetails[key]}
                onChange={handleOrderChange}
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
          >
            Add Order
          </button>
        </form>
      </div>

      {/* Main Content - Delivery Information */}
      <div
        className="w-1/2 p-6"
        style={{
          backgroundColor: "#F4F9F4",
          borderRadius: "15px",
          boxShadow: "0 4px 8px rgba(0, 128, 0, 0.1)",
        }}
      >
        <h2 className="text-2xl mb-4 font-semibold text-black">
          Delivery Information
        </h2>
        <form className="space-y-4">
          {Object.keys(deliveryDetails).map((key) => (
            <div key={key}>
              <label className="block mb-2 text-gray-700">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </label>
              <input
                type={key === "confirmOrderDate" ? "date" : "text"}
                className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none"
                placeholder={`Enter ${key}`}
                name={key}
                value={deliveryDetails[key]}
                readOnly
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
          >
            Submit Delivery
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDelivery;
