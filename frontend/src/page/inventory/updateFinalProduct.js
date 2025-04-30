import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Import useNavigate

const FinalProductUpdateForm = () => {
  const { id } = useParams(); // Get the ID from URL
  const navigate = useNavigate(); // Declare navigate function
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    unit: "",
    reorder_level: "",
    unit_price: "",
    location: "Storage Room 2",
    received_date: "",
    expiry_date: "",
    status: "In Stock",
  });

  const [errors, setErrors] = useState({});

  // Fetch data using the ID
  useEffect(() => {
    const fetchFinalProductData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/finalProduct/${id}`);
        const data = await response.json();
        if (data) {
          setFormData({
            name: data.name,
            quantity: data.quantity,
            unit: data.unit,
            reorder_level: data.reorder_level,
            unit_price: data.unit_price,
            location: data.location,
            received_date: data.received_date.split("T")[0], // Convert to YYYY-MM-DD format
            expiry_date: data.expiry_date.split("T")[0], // Convert to YYYY-MM-DD format
            status: data.status,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchFinalProductData();
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/finalProduct/updateFinalProduct/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Final product updated successfully:", data);
        
        navigate("/inventory/finalProductList"); 
      } else {
        console.error("Failed to update final product");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = "Name is required";
    if (!formData.quantity || formData.quantity < 1) errors.quantity = "Quantity must be at least 1";
    if (!formData.unit) errors.unit = "Unit is required";
    if (formData.unit_price < 0) errors.unit_price = "Unit price cannot be negative";
    if (formData.expiry_date && new Date(formData.expiry_date) <= new Date()) {
      errors.expiry_date = "Expiry date must be in the future";
    }
    return errors;
  };

  return (
    <div className="max-w-4xl p-8 mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="mb-6 text-3xl font-semibold text-center text-blue-900 transition duration-300 hover:text-blue-900">Update Final Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Name */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-600">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Quantity */}
          <div className="mb-4">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-600">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.quantity && <p className="text-sm text-red-500">{errors.quantity}</p>}
          </div>

          {/* Unit */}
          <div className="mb-4">
            <label htmlFor="unit" className="block text-sm font-medium text-gray-600">Unit</label>
            <input
              type="text"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.unit && <p className="text-sm text-red-500">{errors.unit}</p>}
          </div>

          {/* Reorder Level */}
          <div className="mb-4">
            <label htmlFor="reorder_level" className="block text-sm font-medium text-gray-600">Reorder Level</label>
            <input
              type="number"
              name="reorder_level"
              value={formData.reorder_level}
              onChange={handleChange}
              min="0"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.reorder_level && <p className="text-sm text-red-500">{errors.reorder_level}</p>}
          </div>

          {/* Unit Price */}
          <div className="mb-4">
            <label htmlFor="unit_price" className="block text-sm font-medium text-gray-600">Unit Price</label>
            <input
              type="number"
              name="unit_price"
              value={formData.unit_price}
              onChange={handleChange}
              min="0"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.unit_price && <p className="text-sm text-red-500">{errors.unit_price}</p>}
          </div>


          {/* Location */}
          <div className="mb-4">
            <label htmlFor="location" className="block text-sm font-medium text-gray-600">Location</label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="Storage Room 1">Storage Room 1</option>
              <option value="Storage Room 2">Storage Room 2</option>
              <option value="Storage Room 3">Storage Room 3</option>
              <option value="Main Rack Zone">Main Rack Zone</option>
              <option value="Cold Room">Cold Room</option>
            </select>
          </div>

          {/* Received Date */}
          <div className="mb-4">
            <label htmlFor="received_date" className="block text-sm font-medium text-gray-600">Received Date</label>
            <input
              type="date"
              name="received_date"
              value={formData.received_date}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Expiry Date */}
          <div className="mb-4">
            <label htmlFor="expiry_date" className="block text-sm font-medium text-gray-600">Expiry Date</label>
            <input
              type="date"
              name="expiry_date"
              value={formData.expiry_date}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.expiry_date && <p className="text-sm text-red-500">{errors.expiry_date}</p>}
          </div>

          {/* Status */}
          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium text-gray-600">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          <div className="mb-4 md:col-span-2">
          <button type="submit" className="w-full px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none">
            Update
          </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FinalProductUpdateForm;
