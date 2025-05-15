import React, { useState, useEffect } from "react";
import { FaSearch, FaDownload, FaPlus, FaEdit, FaTrash, FaBell, FaEnvelope } from "react-icons/fa";
import WarehouseLayout from "../../components/sidebar/warehouseLayout";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import 'animate.css';
import { useNavigate } from "react-router-dom";
import axios from "axios"; // To make API calls
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

const ViewFinalProducts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [finalProducts, setFinalProducts] = useState([]);
  const navigate = useNavigate();
  

useEffect(() => {
  axios
    .get("http://localhost:5000/api/finalProduct") 
    .then((response) => {
      setFinalProducts(response.data);
    })
    .catch((error) => {
      console.error("Error fetching final product:", error);
    });
}, []);


  const filteredMaterials = finalProducts.filter((material) =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get low stock materials
  const lowStockMaterials = finalProducts.filter((item) => item.quantity < item.reorder_level);


  // Handle delete action
  const handleDelete = (_id) => {
    axios
      .delete(`http://localhost:5000/api/finalProduct/deleteFinalProduct/${_id}`) 
      .then(() => {
        setFinalProducts(finalProducts.filter((item) => item._id !== _id)); // Remove deleted item from state
      })
      .catch((error) => {
        console.error("Error deleting material:", error);
      });
  };

  // Handle update action (navigate to update page)
  const handleUpdate = (_id) => {
    navigate(`/inventory/updateFinalProduct/${_id}`);
  };

  const generateReport = () => {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleString();
  
    doc.setFontSize(16);
    doc.text("Final Products Report", 20, 20);
  
    doc.setFontSize(10);
    doc.text(`Report Generated On: ${currentDate}`, 20, 28);
  
    const headers = [
      ["No", "Product ID", "Name", "Quantity", "Unit Price", "Location", "Status", "Expiry Date", "Received Date"]
    ];
  
    const data = finalProducts.map((product, index) => [
      (index + 1).toString(),
      product.finalProductId?.toString() || "N/A",
      product.name,
      product.quantity.toString(),
      `${product.unit_price?.toFixed(2) || "0.00"}`,
      product.location || "N/A",
      product.status || "N/A",
      new Date(product.expiry_date).toLocaleDateString() || "N/A",
      new Date(product.received_date).toLocaleDateString() || "N/A"
    ]);
  
    autoTable(doc, {
      startY: 35,
      head: headers,
      body: data,
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [33, 150, 243],  // Blue header
        textColor: 255,             // White text
        halign: 'center',
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245], // Light gray for alternate rows
      },
    });
  
    doc.save("Final_Products_Report.pdf");
  };
  
  const generateSingleProductPDF = (product) => {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleString();
  
    doc.setFontSize(16);
    doc.text("Final Product Detail", 20, 20);
  
    doc.setFontSize(10);
    doc.text(`Report Generated On: ${currentDate}`, 20, 28);
  
    const productData = [
      ["Product ID", product.finalProductId || "N/A"],
      ["Name", product.name],
      ["Quantity", product.quantity.toString()],
      ["Unit", product.unit || "N/A"],
      ["Unit Price", `${product.unit_price?.toFixed(2) || "0.00"}`],
      ["Location", product.location || "N/A"],
      ["Status", product.status || "N/A"],
      ["Received Date", new Date(product.received_date).toLocaleDateString() || "N/A"],
      ["Expiry Date", new Date(product.expiry_date).toLocaleDateString() || "N/A"]
    ];
  
    autoTable(doc, {
      startY: 35,
      body: productData,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    });
  
    doc.save(`${product.name}_Details.pdf`);
  };
  

  // Generate a color array based on raw material names
  const generateColorArray = () => {
    const colors = [
      "#8884d8", "#ff6347", "#4caf50", "#ffeb3b", "#2196f3", "#ff5722", "#9c27b0", "#3f51b5"
    ];
    return finalProducts.map((material, index) => colors[index % colors.length]);
  };

  return (
    <WarehouseLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">View Final Products</h1>
      </div>

      {/* Low Stock Notification Section */}
      <div className="flex flex-col p-3 mb-6 text-white bg-red-600 shadow-xl rounded-xl animate__animated animate__bounceIn">
        <div className="flex items-center mb-4">
          <span className="mr-2 text-2xl animate__animated animate__heartBeat animate__infinite">
            <FaBell />
          </span>
          <div>
            <h2 className="text-base font-semibold">Low Stock Alerts</h2>
            <p className="text-lg">There are {lowStockMaterials.length} products with low stock! </p>
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
            placeholder="Search final products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate("/inventory/addFinalProduct")}
            className="flex items-center px-4 py-2 text-white transition bg-green-600 rounded-lg hover:bg-green-500"
          >
            <FaPlus className="mr-2" /> Add Final Product
          </button>
          <button onClick={generateReport} className="flex items-center px-4 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-500">
            <FaDownload className="mr-2" /> Download Report
          </button>
        </div>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-4">
        <div className="p-6 text-green-900 transition duration-300 transform bg-green-200 rounded-lg shadow-xl hover:-translate-y-1 hover:shadow-2xl">
          <h2 className="text-lg font-semibold">Total Quantity</h2>
          <p className="text-2xl">{finalProducts.reduce((acc, item) => acc + item.quantity, 0)}</p>
        </div>
        <div className="p-6 text-red-900 transition duration-300 transform bg-red-200 rounded-lg shadow-xl hover:-translate-y-1 hover:shadow-2xl">
          <h2 className="text-lg font-semibold">Low Stock Alerts</h2>
          <p className="text-2xl">{lowStockMaterials.length}</p>
        </div>
        <div className="p-6 text-green-900 transition duration-300 transform bg-green-200 rounded-lg shadow-xl hover:-translate-y-1 hover:shadow-2xl">
          <h2 className="text-lg font-semibold">Material Types</h2>
          <p className="text-2xl">{finalProducts.length}</p>
        </div>
      </div>

      {/* Material Table */}
      <div className="mb-8 overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow-md">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Quantity</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMaterials.map((material, index) => (
              <tr key={index} className="transition hover:bg-gray-100">
                <td className="p-3">{material.name}</td>
                <td className="p-3">{material.quantity}</td>
                <td className="flex gap-3 p-3">
                  <button onClick={() => handleUpdate(material._id)} className="text-blue-600 hover:text-blue-800">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(material._id)} className="text-red-600 hover:text-red-800">
                    <FaTrash />
                  </button>
                  <button onClick={() => generateSingleProductPDF(material)} className="text-green-600 hover:text-green-800">
                    <FaDownload />
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
                <h3 className="mb-4 text-lg font-semibold text-center">Final Products Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={finalProducts}
                      dataKey="quantity"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      label
                    >
                      {finalProducts.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={generateColorArray()[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend
                      layout="horizontal"
                      align="center"
                      verticalAlign="top"
                      iconSize={10}
                      payload={finalProducts.map((entry, index) => ({
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

export default ViewFinalProducts;
