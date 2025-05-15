import React, { useState } from "react";
import {
  FaTruck,
  FaCog,
  FaSignOutAlt,
  FaPlusCircle,
  FaTasks,
  FaHistory,
  FaTachometerAlt,
  FaUserCircle, // ✅ Added this instead of missing User
} from "react-icons/fa";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom"; // ✅ Added Link
import logo from "../../assets/logo.png"; // Adjust the path to your logo

const Oderslidebar = () => {
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDeliveryDropdown = () => {
    setIsDeliveryOpen(!isDeliveryOpen);
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <motion.div
      className="fixed top-0 left-0 h-screen w-64 bg-green-900 text-white shadow-lg z-10"
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="h-full flex flex-col p-5 overflow-y-auto">
        {/* Profile Icon */}
        <div className="flex justify-center mb-8">
          <Link to="/employeeProfileDashboard">
            <motion.div className="bg-green-600 p-4 rounded-full hover:bg-green-500 transition">
              <FaUserCircle size={40} color="white" /> {/* ✅ Used FaUserCircle */}
            </motion.div>
          </Link>
        </div>

        {/* Menu Section */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-6 text-white">Menu</h2>
          <nav>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleNavigate("/oderdashboard")}
                  className="flex items-center w-full text-left rounded-lg px-4 py-3 transition-all duration-300 hover:bg-green-700 focus:bg-green-700 focus:outline-none"
                >
                  <FaTachometerAlt className="h-6 w-6 mr-4 text-white" />
                  Dashboard
                </button>
              </li>

              <li>
                <button
                  onClick={toggleDeliveryDropdown}
                  className="flex items-center w-full text-left rounded-lg px-4 py-3 transition-all duration-300 hover:bg-green-700 focus:bg-green-700 focus:outline-none"
                >
                  <FaTruck className="h-6 w-6 mr-4 text-white" />
                  Deliveries
                </button>
                {isDeliveryOpen && (
                  <motion.ul
                    className="ml-4 mt-2 space-y-1 bg-green-800 rounded-lg p-2"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    <li>
                      <button
                        onClick={() => handleNavigate("/deliverydetail")}
                        className="w-full flex items-center rounded-lg px-4 py-2 transition-all duration-300 hover:bg-green-700 focus:bg-green-700 focus:outline-none"
                      >
                        <FaPlusCircle className="h-5 w-5 mr-4 text-white" />
                        Delivery Details
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleNavigate("/adddelivery")}
                        className="w-full flex items-center rounded-lg px-4 py-2 transition-all duration-300 hover:bg-green-700 focus:bg-green-700 focus:outline-none"
                      >
                        <FaPlusCircle className="h-5 w-5 mr-4 text-white" />
                        Add Delivery
                      </button>
                    </li>
                  </motion.ul>
                )}
              </li>

              <li>
                <button
                  onClick={() => handleNavigate("/drivervehicledetails")}
                  className="flex items-center w-full text-left rounded-lg px-4 py-3 transition-all duration-300 hover:bg-green-700 focus:bg-green-700 focus:outline-none"
                >
                  <FaTasks className="h-6 w-6 mr-4 text-white" />
                  D & V Details
                </button>
              </li>

              <li>
                <button
                  onClick={() => handleNavigate("/pendingorders")}
                  className="flex items-center w-full text-left rounded-lg px-4 py-3 transition-all duration-300 hover:bg-green-700 focus:bg-green-700 focus:outline-none"
                >
                  <FaHistory className="h-6 w-6 mr-4 text-white" />
                  Order History
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Settings & Logout */}
        <div className="mt-auto pb-4">
          <nav>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleNavigate("/settings")}
                  className="flex items-center w-full text-left rounded-lg px-4 py-3 transition-all duration-300 hover:bg-green-700 focus:bg-green-700 focus:outline-none"
                >
                  <FaCog className="h-6 w-6 mr-4 text-white" />
                  Settings
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate("/logout")}
                  className="flex items-center w-full text-left rounded-lg px-4 py-3 transition-all duration-300 bg-red-500 hover:bg-red-600 focus:bg-red-600 focus:outline-none"
                >
                  <FaSignOutAlt className="h-6 w-6 mr-4 text-white" />
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </motion.div>
  );
};

export default Oderslidebar;
