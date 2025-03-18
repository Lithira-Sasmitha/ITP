import React, { useState } from "react";

const AddFinalProductForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    unit: "",
    unit_price: "",
    description: "",
    location: "Storage Room 3",
    received_date: "",
    expiry_date: "",
    status: "In Stock",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) {
      newErrors.name = "Product name is required";
    }

    if (formData.quantity <= 0 || !Number.isInteger(Number(formData.quantity))) {
      newErrors.quantity = "Quantity must be a positive integer";
    }

    if (formData.unit_price < 0 || isNaN(formData.unit_price)) {
      newErrors.unit_price = "Unit price must be a non-negative number";
    }
    
    if (formData.received_date && formData.expiry_date) {
      if (new Date(formData.received_date) > new Date(formData.expiry_date)) {
        newErrors.date = "Expiry date must be after received date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit(formData); 
  };

  return (
    <div className="max-w-4xl p-6 mx-auto overflow-hidden bg-white rounded-lg shadow-xl">
      <h2 className="mb-6 text-2xl font-semibold text-center text-green-700">Add Final Product</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Product Name */}
        <div>
          <label className="block mb-1 font-medium">Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

        {/* Quantity */}
        <div>
          <label className="block mb-1 font-medium">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          {errors.quantity && <p className="text-sm text-red-500">{errors.quantity}</p>}
        </div>

        {/* Unit */}
        <div>
          <label className="block mb-1 font-medium">Unit (e.g., pcs)</label>
          <input
            type="text"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Unit Price */}
        <div>
          <label className="block mb-1 font-medium">Unit Price</label>
          <input
            type="number"
            name="unit_price"
            value={formData.unit_price}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            step="0.01"
          />
          {errors.unit_price && <p className="text-sm text-red-500">{errors.unit_price}</p>}
        </div>

        {/* Desciption */}
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

       {/* Warehouse Location */}
       <div>
          <label className="block mb-1 font-medium">Warehouse Location</label>
          <select
            name="locaton"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="Storage Room 1">Storage Room 1</option>
            <option value="Storage Room 2">Storage Room 2</option>
            <option value="Storage Room 3">Storage Room 3</option>
            <option value="Main Rack Zone">Main Rack Zone</option>
            <option value="Cold Room">Cold Room</option>
          </select>
          {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
        </div>


        {/* Received Date */}
        <div>
          <label className="block mb-1 font-medium">Received Date</label>
          <input
            type="date"
            name="received_date"
            value={formData.received_date}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Expiry Date */}
        <div>
          <label className="block mb-1 font-medium">Expiry Date</label>
          <input
            type="date"
            name="expiry_date"
            value={formData.expiry_date}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block mb-1 font-medium">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="In Stock">In Stock</option>
            <option value="Low">Low</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full px-4 py-2 mt-4 text-white transition bg-green-600 rounded-lg hover:bg-green-500"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddFinalProductForm;
