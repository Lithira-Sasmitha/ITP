import React, { useState } from "react";

const AddRawMaterialForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    unit: "",
    reorder_level: "",
    unit_price: "",
    supplier_name: "",
    supplier_email: "",
    supplier_phone: "",
    location: "Storage Room 1",
    received_date: "",
    expiry_date: "",
    status: "In Stock",
  });

  const [errors, setErrors] = useState({});

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form validation logic
  const validateForm = () => {
    const newErrors = {};

    if (formData.quantity <= 0) {
      newErrors.quantity = "Quantity must be a positive number";
    }

    if (formData.reorder_level < 0) {
      newErrors.reorder_level = "Reorder level can't be negative";
    }

    if (formData.unit_price < 0) {
      newErrors.unit_price = "Unit price can't be negative";
    }

    if (!formData.supplier_email.includes('@')) {
      newErrors.supplier_email = "Email must contain '@'";
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.supplier_phone)) {
      newErrors.supplier_phone = "Supplier contact must be exactly 10 digits";
    }

    if (!formData.location) {
      newErrors.location = "Warehouse location is required";
    }

    if (formData.received_date && formData.expiry_date) {
      if (new Date(formData.received_date) > new Date(formData.expiry_date)) {
        newErrors.date = "Expiry date must be after received date";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return; // Do not submit if validation fails
    }

    // Ensure onSubmit is a function before calling it
    if (onSubmit && typeof onSubmit === "function") {
      onSubmit(formData); // Pass the form data to the parent onSubmit function
    } else {
      console.error("onSubmit is not a function or is undefined");
    }
  };

  return (
    <div className="max-w-4xl p-6 mx-auto overflow-hidden bg-white rounded-lg shadow-xl">
      <h2 className="mb-6 text-2xl font-semibold text-center text-green-700">Add Raw Material</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
        
        {/* Material Name */}
        <div>
          <label className="block mb-1 font-medium">Material Name</label>
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
          <label className="block mb-1 font-medium">Unit (e.g., kg)</label>
          <input
            type="text"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Reorder Level */}
        <div>
          <label className="block mb-1 font-medium">Reorder Level</label>
          <input
            type="number"
            name="reorder_level"
            value={formData.reorder_level}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          {errors.reorder_level && <p className="text-sm text-red-500">{errors.reorder_level}</p>}
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

        {/* Supplier Name */}
        <div>
          <label className="block mb-1 font-medium">Supplier Name</label>
          <input
            type="text"
            name="supplier_name"
            value={formData.supplier_name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          {errors.supplier_name && <p className="text-sm text-red-500">{errors.supplier_name}</p>}
        </div>

        {/* Supplier Email */}
        <div>
          <label className="block mb-1 font-medium">Supplier Email</label>
          <input
            type="email"
            name="supplier_email"
            value={formData.supplier_email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          {errors.supplier_email && <p className="text-sm text-red-500">{errors.supplier_email}</p>}
        </div>

        {/* Supplier Contact */}
        <div>
          <label className="block mb-1 font-medium">Supplier Contact</label>
          <input
            type="text"
            name="supplier_phone"
            value={formData.supplier_phone}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          {errors.supplier_phone && <p className="text-sm text-red-500">{errors.supplier_phone}</p>}
        </div>

        {/* Warehouse Location */}
        <div>
          <label className="block mb-1 font-medium">Warehouse Location</label>
          <select
            name="location"
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
          {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
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
            Add Material
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRawMaterialForm;
