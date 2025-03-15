import React from "react";
import WarehouseLayout from "../../components/sidebar/warehouseLayout";

const StockMovement = () => {
  const stockMovements = [
    {
      id: 1,
      item: "Coconut Husk",
      type: "Raw Material",
      quantity: 100,
      movementType: "In",
      timestamp: "2025-03-15 10:00 AM",
    },
    {
      id: 2,
      item: "Grow Bags",
      type: "Final Product",
      quantity: 50,
      movementType: "Out",
      timestamp: "2025-03-14 03:30 PM",
    },
    {
      id: 3,
      item: "Pallets",
      type: "Packing Material",
      quantity: 30,
      movementType: "In",
      timestamp: "2025-03-13 01:15 PM",
    },
    {
      id: 4,
      item: "Coir Bricks",
      type: "Final Product",
      quantity: 70,
      movementType: "Out",
      timestamp: "2025-03-12 09:45 AM",
    },
  ];

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
            </tr>
          </thead>
          <tbody>
            {stockMovements.map((movement) => (
              <tr key={movement.id} className="text-center border border-gray-200">
                <td className="p-3 border border-gray-200">{movement.item}</td>
                <td className="p-3 border border-gray-200">{movement.type}</td>
                <td className="p-3 border border-gray-200">{movement.quantity}</td>
                <td
                  className={`p-3 border border-gray-200 font-semibold ${movement.movementType === "In" ? "text-green-600" : "text-red-600"}`}
                >
                  {movement.movementType}
                </td>
                <td className="p-3 border border-gray-200">{movement.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </WarehouseLayout>
  );
};

export default StockMovement;
