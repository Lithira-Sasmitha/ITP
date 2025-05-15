import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const PlaceOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, deliveryPrice, total } = location.state || {};

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({
    name: "",
    address: "",
    phone: "",
    postalCode: "",
  });

  // Validation functions
  const validateName = (value) => {
    const nameRegex = /^[A-Za-z\s]{2,}$/;
    if (!value) return "Name is required";
    if (!nameRegex.test(value))
      return "Name must be at least 2 characters and contain only letters and spaces";
    return "";
  };

  const validateAddress = (value) => {
    if (!value) return "Address is required";
    if (value.length < 5) return "Address must be at least 5 characters long";
    return "";
  };

  const validatePhone = (value) => {
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (!value) return "Phone number is required";
    if (!phoneRegex.test(value))
      return "Please enter a valid phone number (e.g., 123-456-7890)";
    return "";
  };

  const validatePostalCode = (value) => {
    const postalCodeRegex = /^[A-Za-z0-9\s-]{5,}$/;
    if (!value) return "Postal code is required";
    if (!postalCodeRegex.test(value))
      return "Please enter a valid postal code (e.g., 12345 or A1B 2C3)";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const nameError = validateName(name);
    const addressError = validateAddress(address);
    const phoneError = validatePhone(phone);
    const postalCodeError = validatePostalCode(postalCode);

    setValidationErrors({
      name: nameError,
      address: addressError,
      phone: phoneError,
      postalCode: postalCodeError,
    });

    if (nameError || addressError || phoneError || postalCodeError) {
      setError("Please correct the errors in the form");
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
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

  // Handle input change with real-time validation
  const handleInputChange = (setter, validator, field) => (e) => {
    const value = e.target.value;
    setter(value);
    setValidationErrors((prev) => ({
      ...prev,
      [field]: validator(value),
    }));
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
            onChange={handleInputChange(setName, validateName, "name")}
            className="mt-2 block w-full p-4 border border-green-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-600 transition duration-150 ease-in-out transform hover:scale-105"
            required
          />
          {validationErrors.name && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
          )}
        </div>

        {/* Address Input */}
        <div>
          <label className="block text-lg font-medium text-gray-900">
            Address
          </label>
          <input
            type="text"
            value={address}
            onChange={handleInputChange(setAddress, validateAddress, "address")}
            className="mt-2 block w-full p-4 border border-green-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-600 transition duration-150 ease-in-out transform hover:scale-105"
            required
          />
          {validationErrors.address && (
            <p className="mt-1 text-sm text-red-600">
              {validationErrors.address}
            </p>
          )}
        </div>

        {/* Phone Number Input */}
        <div>
          <label className="block text-lg font-medium text-gray-900">
            Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={handleInputChange(setPhone, validatePhone, "phone")}
            className="mt-2 block w-full p-4 border border-green-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-600 transition duration-150 ease-in-out transform hover:scale-105"
            required
          />
          {validationErrors.phone && (
            <p className="mt-1 text-sm text-red-600">
              {validationErrors.phone}
            </p>
          )}
        </div>

        {/* Postal Code Input */}
        <div>
          <label className="block text-lg font-medium text-gray-900">
            Postal Code
          </label>
          <input
            type="text"
            value={postalCode}
            onChange={handleInputChange(
              setPostalCode,
              validatePostalCode,
              "postalCode"
            )}
            className="mt-2 block w-full p-4 border border-green-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-600 transition duration-150 ease-in-out transform hover:scale-105"
            required
          />
          {validationErrors.postalCode && (
            <p className="mt-1 text-sm text-red-600">
              {validationErrors.postalCode}
            </p>
          )}
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
