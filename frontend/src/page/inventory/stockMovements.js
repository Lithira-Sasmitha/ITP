import React, { useState } from "react";
import WarehouseLayout from "../../components/sidebar/warehouseLayout";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa"; // For actions

const StockMovement = () => {
  // Sample static data for stock movements
  const [stockMovements, setStockMovements] = useState([
    {
      id: 1,
      item: "Coconut Shell",
      type: "Raw Material",
      quantity: 100,
      movementType: "In",
      timestamp: "2025-03-15 12:30",
    },
    {
      id: 2,
      item: "Coconut Fiber",
      type: "Raw Material",
      quantity: 50,
      movementType: "Out",
      timestamp: "2025-03-16 14:45",
    },
    // Add more stock movements as required
  ]);

  // Handle adding a stock movement (In or Out)
  const handleAddStockMovement = (movementData) => {
    setStockMovements((prev) => [...prev, movementData]);
  };

  // Handle deleting a stock movement
  const handleDeleteStockMovement = (movementId) => {
    setStockMovements((prev) => prev.filter((movement) => movement.id !== movementId));
  };

  // Handle updating a stock movement
  const handleUpdateStockMovement = (movementId, newQuantity) => {
    setStockMovements((prev) =>
      prev.map((movement) =>
        movement.id === movementId ? { ...movement, quantity: newQuantity } : movement
      )
    );
  };

  return (
    <WarehouseLayout>
      <h1 className="mb-6 text-2xl font-bold">Stock Movement History</h1>
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <table className="w-full border border-collapse border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border border-gray-200">Item Name</th>
              <th className="p-3 border border-gray-200">Type</th>
              <th className="p-3 border border-gray-200">Quantity</th>
              <th className="p-3 border border-gray-200">Movement Type</th>
              <th className="p-3 border border-gray-200">Timestamp</th>
              <th className="p-3 border border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stockMovements.map((movement) => (
              <tr key={movement.id} className="text-center border border-gray-200">
                <td className="p-3 border border-gray-200">{movement.item}</td>
                <td className="p-3 border border-gray-200">{movement.type}</td>
                <td className="p-3 border border-gray-200">{movement.quantity}</td>
                <td
                  className={`p-3 border border-gray-200 font-semibold ${
                    movement.movementType === "In" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {movement.movementType}
                </td>
                <td className="p-3 border border-gray-200">{movement.timestamp}</td>
                <td className="p-3 border border-gray-200">
                  <button
                    onClick={() => handleUpdateStockMovement(movement.id, movement.quantity + 1)}
                    className="text-yellow-600 hover:text-yellow-800"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteStockMovement(movement.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4">
          <button
            onClick={() => handleAddStockMovement({
              id: stockMovements.length + 1,
              item: "New Material",
              type: "Raw Material",
              quantity: 10,
              movementType: "In",
              timestamp: new Date().toISOString(),
            })}
            className="px-4 py-2 text-white bg-blue-500 rounded"
          >
            Add New Movement
          </button>
        </div>
      </div>
    </WarehouseLayout>
  );
};

export default StockMovement;
