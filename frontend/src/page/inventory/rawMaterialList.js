import React, { useState, useEffect } from "react";
import { FaSearch, FaDownload, FaPlus, FaEdit, FaTrash, FaBell, FaEnvelope } from "react-icons/fa";
import WarehouseLayout from "../../components/sidebar/warehouseLayout";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import 'animate.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const ViewRawMaterials = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [rawMaterials, setRawMaterials] = useState([]);
  const navigate = useNavigate();

  // Fetch raw materials
  useEffect(() => {
    fetchRawMaterials();
  }, []);

  const fetchRawMaterials = () => {
    axios
      .get("http://localhost:5000/api/rawMaterial")
      .then((response) => {
        setRawMaterials(response.data);
      })
      .catch((error) => {
        console.error("Error fetching raw materials:", error);
      });
  };

  const filteredMaterials = rawMaterials.filter((material) =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockMaterials = rawMaterials.filter(
    (item) => item.quantity < item.reorder_level
  );

  const handleDelete = (_id) => {
    axios
      .delete(`http://localhost:5000/api/rawMaterial/deleteRawMaterial/${_id}`)
      .then(() => {
        setRawMaterials(rawMaterials.filter((item) => item._id !== _id));
      })
      .catch((error) => {
        console.error("Error deleting material:", error);
      });
  };

  const handleUpdate = (_id) => {
    navigate(`/inventory/updateRawMaterial/${_id}`);
  };

  const generateReport = () => {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleString();
  
    doc.setFontSize(16);
    doc.text("Raw Materials Report", 20, 20);
  
    doc.setFontSize(10);
    doc.text(`Report Generated On: ${currentDate}`, 20, 28);
  
    const headers = [
      ["No","Product ID", "Name", "Quantity", "Supplier Email","Status", "Expiry Date", "Received Date"]
    ];
  
    const data = rawMaterials.map((material, index) => [
      (index + 1).toString(),
      material.rawMaterialId.toString(),
      material.name,
      material.quantity.toString(),
      material.supplier_email || "N/A",
      material.status,
      material.expiry_date ? new Date(material.expiry_date).toLocaleDateString() : "N/A",
      material.received_date ? new Date(material.received_date).toLocaleDateString() : "N/A",
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
        fillColor: [33, 150, 243],  // Blue
        textColor: 255,             // White text
        halign: 'center',
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245], // Light gray
      },
    });
  
    doc.save("Raw_Materials_Report.pdf");
  };

  const generateSingleProductPDF = (material) => {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleString();
  
    doc.setFontSize(16);
    doc.text(`Raw Material Report - ${material.name}`, 20, 20);
  
    doc.setFontSize(10);
    doc.text(`Report Generated On: ${currentDate}`, 20, 28);
  
    const tableData = [
      ["Raw Material ID", material.rawMaterialId || "N/A"],
      ["Name", material.name],
      ["Quantity", material.quantity.toString()],
      ["Supplier Email", material.supplier_email || "N/A"],
      ["Status", material.status || "N/A"],
      ["Expiry Date", material.expiry_date ? new Date(material.expiry_date).toLocaleDateString() : "N/A"],
      ["Received Date", material.received_date ? new Date(material.received_date).toLocaleDateString() : "N/A"]
    ];
  
    autoTable(doc, {
      startY: 35,
      head: [["Field", "Value"]],
      body: tableData,
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [33, 150, 243],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });
  
    doc.save(`Raw_Material_Report_${material.name}.pdf`);
  };
  

  const generateColorArray = () => {
    const colors = [
      "#8884d8", "#ff6347", "#4caf50", "#ffeb3b", "#2196f3", "#ff5722", "#9c27b0", "#3f51b5"
    ];
    return rawMaterials.map((material, index) => colors[index % colors.length]);
  };

  // Actual email sending function
  const sendEmail = (supplierEmail, materialName) => {
    axios
      .post("http://localhost:5000/api/warehouseEmail/send", {
        to: supplierEmail,
        subject: `Reorder Request for ${materialName}`,
        text: `Hello,\n\nWe would like to reorder the raw material: ${materialName}.\n\nThank you.`,
      })
      .then(() => {
        alert(`Email successfully sent to ${supplierEmail}`);
      })
      .catch((error) => {
        console.error("Error sending email:", error);
        alert("Failed to send email.");
      });
  };

  return (
    <WarehouseLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">View Raw Materials</h1>
      </div>

      {/* Low Stock Notifications */}
      <div className="flex flex-col p-3 mb-6 text-white bg-red-600 shadow-xl rounded-xl animate__animated animate__bounceIn">
        <div className="flex items-center mb-4">
          <span className="mr-2 text-2xl animate__animated animate__heartBeat animate__infinite">
            <FaBell />
          </span>
          <div>
            <h2 className="text-base font-semibold">Low Stock Alerts</h2>
            <p className="text-lg">There are {lowStockMaterials.length} materials with low stock!</p>
            <p className="text-lg">
              Click the <span className="underline">Send Email</span> button to reorder.
            </p>
          </div>
        </div>

        {/* Low Stock List */}
        <div className="space-y-4">
          {lowStockMaterials.map((material, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-md">
              <div>
                <h4 className="font-bold text-gray-900">{material.name}</h4>
                <p className="text-gray-600">Quantity: {material.quantity}</p>
              </div>
              <button
                onClick={() => sendEmail(material.supplier_email, material.name)}
                className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-500"
              >
                <FaEnvelope className="mr-2" /> Send Email
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Search and Buttons */}
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
            className="flex items-center px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-500"
          >
            <FaPlus className="mr-2" /> Add Raw Material
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
        <div className="p-6 text-green-900 bg-green-200 rounded-lg shadow-xl">
          <h2 className="text-lg font-semibold">Total Quantity</h2>
          <p className="text-2xl">{rawMaterials.reduce((acc, item) => acc + item.quantity, 0)}</p>
        </div>
        <div className="p-6 text-red-900 bg-red-200 rounded-lg shadow-xl">
          <h2 className="text-lg font-semibold">Low Stock Alerts</h2>
          <p className="text-2xl">{lowStockMaterials.length}</p>
        </div>
        <div className="p-6 text-green-900 bg-green-200 rounded-lg shadow-xl">
          <h2 className="text-lg font-semibold">Total Suppliers</h2>
          <p className="text-2xl">{[...new Set(rawMaterials.map((item) => item.supplier_email))].length}</p>
        </div>
        <div className="p-6 text-green-900 bg-green-200 rounded-lg shadow-xl">
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
                <td className="p-3">{material.supplier_email}</td>
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

      {/* Pie Chart */}
      <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-xl">
        <div className="w-full">
          <h3 className="mb-4 text-lg font-semibold text-center">Raw Material Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={rawMaterials}
                dataKey="quantity"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {rawMaterials.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={generateColorArray()[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                layout="horizontal"
                align="center"
                verticalAlign="top"
                iconSize={10}
                payload={rawMaterials.map((entry, index) => ({
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

export default ViewRawMaterials;
