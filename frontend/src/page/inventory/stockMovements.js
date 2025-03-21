import React, { useEffect, useState } from 'react';
import axios from 'axios';
import WarehouseLayout from '../../components/sidebar/warehouseLayout';

const StockMovementTable = () => {
  const [stockMovements, setStockMovements] = useState([]);

  useEffect(() => {
    const fetchStockMovements = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/stockMovement');
        setStockMovements(response.data);
      } catch (error) {
        console.error('Error fetching stock movements:', error);
      }
    };

    fetchStockMovements();
  }, []);

  const getMovementTypeStyle = (type) => {
    return type === 'In' ? 'bg-green-500' : 'bg-red-500';  // Green for 'In', Red for 'Out'
  };

  return (
    <WarehouseLayout>
    <div className="container p-4 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Stock Movement History</h1>
      <table className="w-full border-collapse table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Product Name</th>
            <th className="px-4 py-2 border-b">Product Type</th>
            <th className="px-4 py-2 border-b">Quantity</th>
            <th className="px-4 py-2 border-b">Location</th>
            <th className="px-4 py-2 border-b">Date</th>
            <th className="px-4 py-2 border-b">Movement Type</th>
          </tr>
        </thead>
        <tbody>
          {stockMovements.length > 0 ? (
            stockMovements.map((movement, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="px-4 py-2 border-b">{movement.productName}</td>
                <td className="px-4 py-2 border-b">{movement.productType}</td>
                <td className="px-4 py-2 border-b">{movement.quantity}</td>
                <td className="px-4 py-2 border-b">{movement.location}</td>
                <td className="px-4 py-2 border-b">{new Date(movement.date).toLocaleDateString()}</td>
                <td className={`px-4 py-2 border-b ${getMovementTypeStyle(movement.type)} text-white`}>
                  {movement.type}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="py-4 text-center">No stock movements available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </WarehouseLayout>
  );
};

export default StockMovementTable;
