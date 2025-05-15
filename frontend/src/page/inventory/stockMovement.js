import React, { useEffect, useState } from "react";
import WarehouseLayout from "../../components/sidebar/warehouseLayout";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const StockMovementHistory = () => {
  const [movements, setMovements] = useState([]);
  const [filteredMovements, setFilteredMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchMovements();
  }, []);

  const fetchMovements = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/stockMovement");
      setMovements(res.data);
      setFilteredMovements(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching stock movements:", error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this stock movement?")) {
      try {
        await axios.delete(`http://localhost:5000/api/stockMovement/deleteStockMovement/${id}`);
        fetchMovements(); // Refresh list
      } catch (error) {
        console.error("Error deleting stock movement:", error);
      }
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = movements.filter((move) =>
      move.productName?.toLowerCase().includes(value)
    );
    setFilteredMovements(filtered);
  };

  const downloadCSV = () => {
    if (filteredMovements.length === 0) {
      alert("No stock movement data to export.");
      return;
    }

    const headers = ["#", "Product Name", "Product Type", "Movement Type", "Quantity", "Date"];
    const rows = filteredMovements.map((move, index) => [
      index + 1,
      move.productName || "Deleted Product",
      move.productType || "N/A",
      move.movementType || "N/A",
      move.quantity ?? 0,
      move.date ? new Date(move.date).toLocaleString() : "N/A"
    ]);

    let csvContent = headers.join(",") + "\n";
    rows.forEach((row) => {
      csvContent += row.map((val) => `"${val}"`).join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "stock_movement_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    if (filteredMovements.length === 0) {
      alert("No stock movement data to export.");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Stock Movement Report", 14, 20);

    const tableColumn = ["#", "Product Name", "Product Type", "Movement", "Qty", "Date"];
    const tableRows = filteredMovements.map((move, index) => [
      index + 1,
      move.productName || "Deleted Product",
      move.productType || "N/A",
      move.movementType,
      move.quantity,
      new Date(move.date).toLocaleString()
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 100, 0] },
    });

    doc.save("stock_movement_report.pdf");
  };

  return (
    <WarehouseLayout>
      <div className="min-h-screen p-6 bg-white">
        <h1 className="mb-6 text-2xl font-bold text-black">Stock Movement History</h1>

        <div className="flex flex-col justify-between gap-4 mb-4 sm:flex-row">
          <input
            type="text"
            placeholder="Search by Product Name"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 border border-gray-300 rounded sm:w-1/3"
          />
          <div className="flex gap-2">
            <button
              onClick={downloadCSV}
              className="px-4 py-2 text-white bg-black rounded hover:bg-gray-800"
            >
              CSV Report
            </button>
            <button
              onClick={downloadPDF}
              className="px-4 py-2 text-white bg-green-700 rounded hover:bg-green-800"
            >
              PDF Report
            </button>
          </div>
        </div>

        {loading ? (
          <div className="font-semibold text-center text-red-600">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead className="text-white bg-green-900">
                <tr>
                  <th className="px-6 py-3 border-b">#</th>
                  <th className="px-6 py-3 border-b">Product Name</th>
                  <th className="px-6 py-3 border-b">Product Type</th>
                  <th className="px-6 py-3 border-b">Movement Type</th>
                  <th className="px-6 py-3 border-b">Quantity</th>
                  <th className="px-6 py-3 border-b">Date</th>
                  <th className="px-6 py-3 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMovements.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-4 text-center text-gray-500">
                      No stock movements found.
                    </td>
                  </tr>
                ) : (
                  filteredMovements.map((move, index) => (
                    <tr key={move._id} className="transition hover:bg-gray-100">
                      <td className="px-6 py-3 text-center border-b">{index + 1}</td>
                      <td className="px-6 py-3 text-center border-b">
                        {move.productName || "Deleted Product"}
                      </td>
                      <td className="px-6 py-3 text-center border-b">{move.productType}</td>
                      <td className={`py-3 px-6 border-b text-center font-semibold ${move.movementType === 'IN' ? 'text-green-600' : 'text-red-600'}`}>
                        {move.movementType}
                      </td>
                      <td className="px-6 py-3 text-center border-b">{move.quantity}</td>
                      <td className="px-6 py-3 text-center border-b">
                        {move.date ? new Date(move.date).toLocaleString() : "N/A"}
                      </td>
                      <td className="px-6 py-3 text-center border-b">
                        <button
                          onClick={() => handleDelete(move._id)}
                          className="px-3 py-1 text-white bg-red-600 rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </WarehouseLayout>
  );
};

export default StockMovementHistory;
