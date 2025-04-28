import React, { useEffect, useState } from "react";
import WarehouseLayout from "../../components/sidebar/warehouseLayout";
import axios from "axios";

const StockMovementHistory = () => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovements();
  }, []);

  const fetchMovements = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/stockMovement");
      console.log("Fetched Movements:", res.data);  // Log the response to check data
      setMovements(res.data);
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
        // After deleting, refresh the movement list
        fetchMovements();
      } catch (error) {
        console.error("Error deleting stock movement:", error);
      }
    }
  };
  

  return (
    
    <WarehouseLayout>
    <div className="min-h-screen p-6 bg-white">
      <h1 className="mb-6 text-2xl font-bold text-black">Stock Movement History</h1>

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
              {movements && movements.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-500">
                    No stock movements found.
                  </td>
                </tr>
              ) : (
                movements.map((move, index) => (
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
                    <td className="px-6 py-3 text-center border-b">{new Date(move.date).toLocaleString()}</td>
                    <td className="px-6 py-3 text-center border-b">
                        <button 
                                onClick={() => handleDelete(move._id)}
                                className="px-3 py-1 text-white bg-red-600 rounded hover:bg-red-700"
                        >Delete</button></td>
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
