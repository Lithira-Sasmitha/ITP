import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // ✅ Added Link here
import { motion } from "framer-motion"; // ✅ Added motion here
import {
  FaChartBar,
  FaWarehouse,
  FaCubes,
  FaBarcode,
  FaEnvelope,
  FaUserCircle, // ✅ Replaced User with FaUserCircle
} from "react-icons/fa";
import logo from "../../assets/logo.png";

const WarehouseLayout = ({ children }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="flex flex-col justify-between w-64 p-5 text-white bg-green-900 shadow-lg">
        <div>
          <div className="flex justify-center mb-8">
            <Link to="/employeeProfileDashboard">
              <motion.div className="bg-green-600 p-4 rounded-full hover:bg-green-500 transition">
                <FaUserCircle size={40} color="white" /> {/* ✅ Used FaUserCircle */}
              </motion.div>
            </Link>
          </div>
          <nav>
            <ul>

              <li className="mb-4">
                <button
                  onClick={() => navigate("/inventory/inventoryPage")}
                  className="flex items-center w-full p-3 rounded-lg hover:bg-green-700"
                >
                  <FaWarehouse className="mr-4" /> Inventory
                </button>
              </li>

              <li className="mb-4">
                <button
                  onClick={() => navigate("/inventory/dashboard")}
                  className="flex items-center w-full p-3 rounded-lg hover:bg-green-700"
                >
                  <FaChartBar className="mr-4" /> Dashboard
                </button>
              </li>

              <li className="mb-4">
                <button
                  onClick={() => navigate("/inventory/stockMovement")}
                  className="flex items-center w-full p-3 rounded-lg hover:bg-green-700"
                >
                  <FaCubes className="mr-4" /> Stock Movements
                </button>
              </li>

              <li className="mb-4">
                <button
                  onClick={() => navigate("/inventory/finalProductQR")}
                  className="flex items-center w-full p-3 rounded-lg hover:bg-green-700"
                >
                  <FaBarcode className="mr-4" /> QR Generator
                </button>
              </li>

            </ul>
          </nav>
        </div>
        <div className="text-sm text-gray-300">
          <div className="flex items-center mb-2">
            <FaEnvelope className="mr-2" /> ceyloncoirlimited@gmail.com
          </div>
          <div>{currentTime.toLocaleTimeString()}</div>
        </div>
      </div>

      {/* Main content wrapper */}
      <div className="flex-grow p-8 overflow-y-auto">{children}</div>
    </div>
  );
};

export default WarehouseLayout;
