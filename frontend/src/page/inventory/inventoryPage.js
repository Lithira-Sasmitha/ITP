import React from "react";
import WarehouseLayout from "../../components/sidebar/warehouseLayout";
import { useNavigate } from "react-router-dom";
import { FaBoxes, FaCubes, FaTruckLoading } from "react-icons/fa";

const Inventory = () => {
  const navigate = useNavigate();

  const inventory = {
    rawMaterials: [
      { name: "Coconut Husk", quantity: 400 },
      { name: "Coir Fiber", quantity: 300 },
      { name: "Dust", quantity: 300 },
    ],
    packingMaterials: [
      { name: "Bags", quantity: 200 },
      { name: "Straps", quantity: 150 },
      { name: "Pallets", quantity: 100 },
    ],
    finalProducts: [
      { name: "Coco Peat Blocks", quantity: 250 },
      { name: "Grow Bags", quantity: 180 },
      { name: "Coir Bricks", quantity: 120 },
    ],
  };

  const renderCategory = (title, items, icon, bgColor, textColor, navPath) => (
    <div className="w-full p-4 md:w-1/3">
      <div className={`p-5 rounded-2xl transform transition duration-300 hover:-translate-y-1 hover:shadow-2xl ${bgColor}`}>
        <h2 className={`flex items-center mb-4 text-xl font-bold ${textColor}`}>
          {icon} <span className="ml-2">{title}</span>
        </h2>
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li
              key={index}
              className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
            >
              <span>{item.name}</span>
              <span className="text-sm font-semibold text-gray-700">{item.quantity} units</span>
            </li>
          ))}
        </ul>
        <button
          onClick={() => navigate(navPath)}
          className="px-4 py-2 mt-4 text-sm font-semibold text-white transition bg-gray-800 rounded hover:bg-gray-700"
        >
          View {title}
        </button>
      </div>
    </div>
  );

  return (
    <WarehouseLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Inventory Overview</h1>
      </div>

      <div className="flex flex-wrap -mx-4">
        {renderCategory("Raw Materials", inventory.rawMaterials, <FaTruckLoading />, "bg-purple-300", "text-purple-900", "/inventory/rawMaterialList")}
        {renderCategory("Packing Materials", inventory.packingMaterials, <FaBoxes />, "bg-sky-300", "text-sky-900", "/inventory/packingMaterialList")}
        {renderCategory("Final Products", inventory.finalProducts, <FaCubes />, "bg-rose-300", "text-rose-900", "/inventory/finalProductList")}
      </div>
    </WarehouseLayout>
  );
};

export default Inventory;
