import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const PlaceOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, deliveryPrice, total } = location.state || {}; // Fallback if state is not provided

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!name || !address || !phone || !postalCode) {
      setError("Please fill in all fields");
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Submit order to backend
      const response = await axios.post(`${API_URL}/orders`, {
        name,
        address,
        phone,
        postalCode,
        cartItems,
        deliveryPrice,
        total,
      });

      console.log("Order placed successfully:", response.data);

      // Navigate to order confirmation page
      navigate("/order-confirmation", {
        state: {
          orderId: response.data._id,
          orderDetails: response.data,
        },
      });
    } catch (error) {
      console.error("Error placing order:", error);
      setError("Failed to place order. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-green-100 to-white rounded-2xl shadow-xl transform transition-all duration-500">
      <form onSubmit={handleSubmit} className="space-y-10">
        <h2 className="text-5xl font-extrabold text-center text-green-800 mb-8">
          Place Your Order
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Name Input */}
        <div>
          <label className="block text-lg font-medium text-gray-900">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 block w-full p-4 border border-green-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-600 transition duration-150 ease-in-out transform hover:scale-105"
            required
          />
        </div>

        {/* Address Input */}
        <div>
          <label className="block text-lg font-medium text-gray-900">
            Address
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-2 block w-full p-4 border border-green-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-600 transition duration-150 ease-in-out transform hover:scale-105"
            required
          />
        </div>

        {/* Phone Number Input */}
        <div>
          <label className="block text-lg font-medium text-gray-900">
            Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-2 block w-full p-4 border border-green-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-600 transition duration-150 ease-in-out transform hover:scale-105"
            required
          />
        </div>

        {/* Postal Code Input */}
        <div>
          <label className="block text-lg font-medium text-gray-900">
            Postal Code
          </label>
          <input
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className="mt-2 block w-full p-4 border border-green-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-600 transition duration-150 ease-in-out transform hover:scale-105"
            required
          />
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          <h3 className="text-3xl font-semibold text-gray-800">
            Order Summary
          </h3>
          <div className="space-y-2">
            {cartItems &&
              cartItems.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between py-4 px-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:translate-y-1"
                >
                  <span className="text-gray-700">{item.name}</span>
                  <span className="text-gray-900 font-medium">
                    {item.quantity} x ${item.price} = $
                    {(item.quantity * item.price).toFixed(2)}
                  </span>
                </div>
              ))}
          </div>
          <div className="mt-4 font-semibold text-lg">
            <div className="flex justify-between">
              <span className="text-gray-900">Delivery Price</span>
              <span className="text-gray-800">${deliveryPrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-800">${total}</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-6 ${
            isSubmitting ? "bg-gray-500" : "bg-green-700 hover:bg-green-800"
          } text-white rounded-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-green-500 transition duration-200 ease-in-out transform hover:scale-105`}
        >
          {isSubmitting ? "Processing..." : "Submit Order"}
        </button>
      </form>
    </div>
  );
};

export default PlaceOrder;
