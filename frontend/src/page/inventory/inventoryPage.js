import React from "react";
import {
  FaWarehouse,
  FaBoxOpen,
  FaCubes,
  FaTruckLoading,
} from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";
import WarehouseLayout from "../../components/sidebar/warehouseLayout";

const InventoryWelcome = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full animate-fadeIn">
      <div className="w-full max-w-5xl p-10 bg-white shadow-2xl rounded-3xl">
        {/* Header with Icon */}
        <h1 className="flex items-center justify-center gap-3 mb-6 text-5xl font-extrabold text-center text-green-800 drop-shadow-lg">
          <FaWarehouse className="text-6xl text-green-700 animate-pulse" />
          Welcome to Inventory Manager
        </h1>

        {/* Subheading */}
        <p className="mb-10 text-lg text-center text-gray-700">
          Organize and manage your stock, supplies, and storage efficiently — all in one place.
        </p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {/* Raw Materials */}
          <div className="p-6 transition duration-300 transform bg-green-100 shadow-lg rounded-xl hover:scale-105">
            <div className="flex items-center gap-3 mb-2">
              <FaBoxOpen className="text-3xl text-green-700" />
              <h3 className="text-2xl font-semibold text-green-900">Raw Materials</h3>
            </div>
            <p className="text-gray-600">
              Monitor and track your raw materials inventory in real-time.
            </p>
          </div>

          {/* Packing Materials */}
          <div className="p-6 transition duration-300 transform bg-blue-100 shadow-lg rounded-xl hover:scale-105">
            <div className="flex items-center gap-3 mb-2">
              <FaCubes className="text-3xl text-blue-700" />
              <h3 className="text-2xl font-semibold text-blue-900">Packing Materials</h3>
            </div>
            <p className="text-gray-600">
              Keep tabs on your packaging supplies and automate reorder alerts.
            </p>
          </div>

          {/* Final Products */}
          <div className="p-6 transition duration-300 transform shadow-lg bg-rose-100 rounded-xl hover:scale-105">
            <div className="flex items-center gap-3 mb-2">
              <FaTruckLoading className="text-3xl text-rose-700" />
              <h3 className="text-2xl font-semibold text-rose-900">Final Products</h3>
            </div>
            <p className="text-gray-600">
              View finished product inventory and prepare for shipment.
            </p>
          </div>

          {/* Warehouse Space */}
          <div className="p-6 transition duration-300 transform bg-yellow-100 shadow-lg rounded-xl hover:scale-105">
            <div className="flex items-center gap-3 mb-2">
              <MdSpaceDashboard className="text-3xl text-yellow-700" />
              <h3 className="text-2xl font-semibold text-yellow-900">Warehouse Space</h3>
            </div>
            <p className="text-gray-600">
              Check your storage capacity and optimize space usage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Page with Layout
const InventoryWelcomePage = () => {
  return (
    <WarehouseLayout>
      <InventoryWelcome />
    </WarehouseLayout>
  );
};

export default InventoryWelcomePage;
