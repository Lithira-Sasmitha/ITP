import React, { useState } from "react";

const AddPackingMaterialForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    unit: "",
    reorder_level: "",
    unit_price: "",
    supplier_name: "",
    supplier_email: "",
    supplier_phone: "",
    location: "",
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

    if (!formData.supplier_name) {
      newErrors.supplier_name = "Supplier name is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // Return false if there are errors
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit(formData); // Callback to parent or API
  };

  return (
    <div className="max-w-4xl p-6 mx-auto overflow-hidden bg-white rounded-lg shadow-xl">
      <h2 className="mb-6 text-2xl font-semibold text-center text-green-700">Add Packing Material</h2>
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
            required
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
            required
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
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
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
            Add Material
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPackingMaterialForm;
