import React, { useState } from "react";
import { FaSearch, FaDownload, FaPlus, FaEdit, FaTrash, FaBell, FaEnvelope } from "react-icons/fa"; // Import FaEnvelope
import WarehouseLayout from "../../components/sidebar/warehouseLayout";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import 'animate.css';
import { useNavigate } from "react-router-dom";



const rawMaterials = [
  { name: "Coconut Husk", quantity: 400, supplier: "supplier1@email.com" },
  { name: "Coir Fiber", quantity: 300, supplier: "supplier2@email.com" },
  { name: "Dust", quantity: 120, supplier: "supplier3@email.com" },
];

const lowStockThreshold = 150; // Set low stock threshold
const COLORS = ["#8e44ad", "#3498db", "#e74c3c"];

const trendData = [
  { month: "Jan", usage: 200 },
  { month: "Feb", usage: 180 },
  { month: "Mar", usage: 220 },
  { month: "Apr", usage: 190 },
];

const ViewRawMaterials = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Filter materials based on search term
  const filteredMaterials = rawMaterials.filter((material) =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get low stock materials
  const lowStockMaterials = rawMaterials.filter((item) => item.quantity < lowStockThreshold);

  // Function to send email (Placeholder)
  const sendEmail = (supplierEmail) => {
    alert(`Email sent to ${supplierEmail}`);
  };

  return (
    <WarehouseLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">View Raw Materials</h1>
      </div>

     {/* Low Stock Notification Section */}
     <div className="flex flex-col p-3 mb-6 text-white bg-red-600 shadow-xl rounded-xl animate__animated animate__bounceIn">
  <div className="flex items-center mb-4">
    <span className="mr-2 text-2xl animate__animated animate__heartBeat animate__infinite">
      <FaBell />
    </span>
    <div>
      <h2 className="text-base font-semibold">Low Stock Alerts</h2>
      <p className="text-lg">There are {lowStockMaterials.length} materials with low stock! </p>
      <p className="text-lg">If you want to reorder this raw material, click the <span className="underline">Send Email</span> button to contact the supplier directly.</p>
    </div>
  </div>


  {/* Low Stock Materials List */}
  <div className="space-y-4">
    {lowStockMaterials.map((material, index) => (
      <div key={index} className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-md">
        <div>
          <h4 className="font-bold text-gray-900">{material.name}</h4>
          <p className="text-gray-600">Quantity: {material.quantity}</p>
        </div>
        <button
          onClick={() => sendEmail(material.supplier)}
          className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-500"
        >
          <FaEnvelope className="mr-2" /> Send Email
        </button>
      </div>
    ))}
  </div>
</div>


      {/* Search and Actions */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <div className="flex items-center w-full mb-4 md:w-auto md:mb-0">
          <FaSearch className="mr-2 text-gray-600" />
          <input
            type="text"
            placeholder="Search raw materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate("/inventory/addRawMaterial")}
            className="flex items-center px-4 py-2 text-white transition bg-green-600 rounded-lg hover:bg-green-500"
          >
            <FaPlus className="mr-2" /> Add Raw Material
          </button>
          <button className="flex items-center px-4 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-500">
            <FaDownload className="mr-2" /> Download Report
          </button>
        </div>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-4 ">
        <div className="p-6 text-green-900 transition duration-300 transform bg-green-200 rounded-lg shadow-xl hover:-translate-y-1 hover:shadow-2xl">
          <h2 className="text-lg font-semibold">Total Quantity</h2>
          <p className="text-2xl">{rawMaterials.reduce((acc, item) => acc + item.quantity, 0)}</p>
        </div>
        <div className="p-6 text-red-900 transition duration-300 transform bg-red-200 rounded-lg shadow-xl hover:-translate-y-1 hover:shadow-2xl">
          <h2 className="text-lg font-semibold">Low Stock Alerts</h2>
          <p className="text-2xl">{lowStockMaterials.length}</p>
        </div>
        <div className="p-6 text-green-900 transition duration-300 transform bg-green-200 rounded-lg shadow-xl hover:-translate-y-1 hover:shadow-2xl">
          <h2 className="text-lg font-semibold">Total Suppliers</h2>
          <p className="text-2xl">{[...new Set(rawMaterials.map((item) => item.supplier))].length}</p>
        </div>
        <div className="p-6 text-green-900 transition duration-300 transform bg-green-200 rounded-lg shadow-xl hover:-translate-y-1 hover:shadow-2xl">
          <h2 className="text-lg font-semibold">Material Types</h2>
          <p className="text-2xl">{rawMaterials.length}</p>
        </div>
      </div>

      {/* Material Table */}
      <div className="mb-8 overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow-md">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Quantity</th>
              <th className="p-3 text-left">Supplier Email</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMaterials.map((material, index) => (
              <tr key={index} className="transition hover:bg-gray-100">
                <td className="p-3">{material.name}</td>
                <td className="p-3">{material.quantity}</td>
                <td className="p-3">{material.supplier}</td>
                <td className="flex gap-3 p-3">
                  <button className="text-blue-600 hover:text-blue-800">
                    <FaEdit />
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

              {/* Charts Section */}
<div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-xl">

{/* Right Side (Pie Chart) */}
<div className="w-full">
  <h3 className="mb-4 text-lg font-semibold text-center">Raw Material Distribution</h3>
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={rawMaterials}
        dataKey="quantity"
        nameKey="name"
        outerRadius={100}
        label
      >
        {rawMaterials.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend verticalAlign="top" height={36} />
    </PieChart>
  </ResponsiveContainer>
</div>
</div>


    </WarehouseLayout>
  );
};

export default ViewRawMaterials;
