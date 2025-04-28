import React, { useState, useEffect } from "react";
import { FaSearch, FaDownload, FaPlus, FaEdit, FaTrash, FaBell, FaEnvelope } from "react-icons/fa";
import WarehouseLayout from "../../components/sidebar/warehouseLayout";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import 'animate.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf";

const ViewPackingMaterials = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [packingMaterials, setPackingMaterials] = useState([]);
  const [sendingEmailId, setSendingEmailId] = useState(null); // To handle button loading states
  const navigate = useNavigate();

  // Fetch packing materials
  useEffect(() => {
    fetchPackingMaterials();
  }, []);

  const fetchPackingMaterials = () => {
    axios
      .get("http://localhost:5000/api/packingMaterial")
      .then((response) => {
        setPackingMaterials(response.data);
      })
      .catch((error) => {
        console.error("Error fetching packing materials:", error);
      });
  };

  const filteredMaterials = packingMaterials.filter((material) =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockMaterials = packingMaterials.filter((item) => item.quantity < item.reorder_level);

  // Handle send email
  const sendEmail = (supplierEmail, materialName) => {
    setSendingEmailId(materialName); // To show loading spinner
    axios
      .post("http://localhost:5000/api/warehouseEmail/send", {
        to: supplierEmail,
        subject: `Reorder Request for Packing Material: ${materialName}`,
        message: `Dear Supplier,\n\nOur stock for "${materialName}" is running low. Kindly send a new supply.\n\nBest regards,\nWarehouse Management`
      })
      .then((response) => {
        alert(`Email successfully sent to ${supplierEmail}`);
      })
      .catch((error) => {
        console.error("Error sending email:", error);
        alert("Failed to send email. Please try again.");
      })
      .finally(() => {
        setSendingEmailId(null);
      });
  };

  // Handle delete
  const handleDelete = (_id) => {
    if (window.confirm("Are you sure you want to delete this material?")) {
      axios
        .delete(`http://localhost:5000/api/packingMaterial/deletePackingMaterial/${_id}`)
        .then(() => {
          setPackingMaterials(packingMaterials.filter((item) => item._id !== _id));
        })
        .catch((error) => {
          console.error("Error deleting material:", error);
        });
    }
  };

  // Handle update
  const handleUpdate = (_id) => {
    navigate(`/inventory/updatePackingMaterial/${_id}`);
  };

  // Generate and download report
  const generateReport = () => {
    const doc = new jsPDF();
    doc.text("Packing Materials Report", 20, 20);
    packingMaterials.forEach((material, index) => {
      doc.text(`${material.name} - Quantity: ${material.quantity}`, 20, 30 + index * 10);
    });
    doc.save("packing_materials_report.pdf");
  };

  const generateColorArray = () => {
    const colors = [
      "#8884d8", "#ff6347", "#4caf50", "#ffeb3b", "#2196f3", "#ff5722", "#9c27b0", "#3f51b5"
    ];
    return packingMaterials.map((material, index) => colors[index % colors.length]);
  };

  return (
    <WarehouseLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">View Packing Materials</h1>
      </div>

      {/* Low Stock Notification */}
      <div className="flex flex-col p-4 mb-6 text-white bg-red-600 shadow-xl rounded-xl animate__animated animate__fadeIn">
        <div className="flex items-center mb-4">
          <FaBell className="mr-4 text-3xl animate__animated animate__heartBeat animate__infinite" />
          <div>
            <h2 className="text-base font-semibold">Low Stock Alerts</h2>
            <p className="text-lg">
              There are {lowStockMaterials.length} materials with low stock!
            </p>
            <p className="text-sm">Click <span className="underline">Send Email</span> to reorder.</p>
          </div>
        </div>
        <div className="grid gap-4">
          {lowStockMaterials.map((material) => (
            <div key={material._id} className="flex justify-between p-3 text-gray-800 bg-white rounded-lg shadow-md">
              <div>
                <h4 className="font-bold">{material.name}</h4>
                <p>Quantity: {material.quantity}</p>
              </div>
              <button
                disabled={sendingEmailId === material.name}
                onClick={() => sendEmail(material.supplier_email, material.name)}
                className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-500 disabled:bg-gray-400"
              >
                <FaEnvelope className="mr-2" />
                {sendingEmailId === material.name ? "Sending..." : "Send Email"}
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
            placeholder="Search packing materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate("/inventory/addPackingMaterial")}
            className="flex items-center px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-500"
          >
            <FaPlus className="mr-2" /> Add Packing Material
          </button>
          <button
            onClick={generateReport}
            className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-500"
          >
            <FaDownload className="mr-2" /> Download Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-4">
        <div className="p-6 text-green-900 transition transform bg-green-200 rounded-lg shadow-xl hover:-translate-y-1">
          <h2 className="text-lg font-semibold">Total Quantity</h2>
          <p className="text-2xl">{packingMaterials.reduce((acc, item) => acc + item.quantity, 0)}</p>
        </div>
        <div className="p-6 text-red-900 transition transform bg-red-200 rounded-lg shadow-xl hover:-translate-y-1">
          <h2 className="text-lg font-semibold">Low Stock</h2>
          <p className="text-2xl">{lowStockMaterials.length}</p>
        </div>
        <div className="p-6 text-green-900 transition transform bg-green-200 rounded-lg shadow-xl hover:-translate-y-1">
          <h2 className="text-lg font-semibold">Total Suppliers</h2>
          <p className="text-2xl">{[...new Set(packingMaterials.map((item) => item.supplier_email))].length}</p>
        </div>
        <div className="p-6 text-green-900 transition transform bg-green-200 rounded-lg shadow-xl hover:-translate-y-1">
          <h2 className="text-lg font-semibold">Material Types</h2>
          <p className="text-2xl">{packingMaterials.length}</p>
        </div>
      </div>

      {/* Materials Table */}
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
            {filteredMaterials.map((material) => (
              <tr key={material._id} className="transition hover:bg-gray-100">
                <td className="p-3">{material.name}</td>
                <td className="p-3">{material.quantity}</td>
                <td className="p-3">{material.supplier_email}</td>
                <td className="flex gap-3 p-3">
                  <button onClick={() => handleUpdate(material._id)} className="text-blue-600 hover:text-blue-800">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(material._id)} className="text-red-600 hover:text-red-800">
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
        <div className="w-full">
          <h3 className="mb-4 text-lg font-semibold text-center">Packing Material Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={packingMaterials}
                dataKey="quantity"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {packingMaterials.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={generateColorArray()[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                layout="horizontal"
                align="center"
                verticalAlign="top"
                iconSize={10}
                payload={packingMaterials.map((entry, index) => ({
                  value: entry.name,
                  type: "square",
                  color: generateColorArray()[index]
                }))}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </WarehouseLayout>
  );
};

export default ViewPackingMaterials;
