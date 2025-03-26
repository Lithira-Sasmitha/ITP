import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSignOutAlt,
  FaTimesCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

export default function Logout() {
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bgPosition, setBgPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgPosition((prev) => (prev + 1) % 200);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleLogoutClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmLogout = () => {
    console.log("User logged out");
    navigate("/adminlogin");
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen relative overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(45deg, #ff0000, #0000ff, #ff0000, #0000ff)",
        backgroundSize: "400% 400%",
        backgroundPosition: `${bgPosition}% ${bgPosition}%`,
        transition: "background-position 0.5s ease",
      }}
    >
      <div className="bg-white p-10 rounded-2xl shadow-2xl text-center max-w-md mx-auto z-10 transform transition-all duration-300 hover:scale-105">
        <div className="mb-6 text-6xl text-red-500 animate-pulse">
          <FaExclamationTriangle />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Logout from Order & Delivery Manager
        </h2>
        {showConfirmation ? (
          <>
            <p className="text-gray-600 mb-8 text-lg">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-around">
              <button
                onClick={handleConfirmLogout}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold px-8 py-3 rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                <FaSignOutAlt className="inline mr-2" />
                Yes, Logout
              </button>
              <button
                onClick={handleCancel}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold px-8 py-3 rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                <FaTimesCircle className="inline mr-2" />
                Cancel
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={handleLogoutClick}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold px-10 py-3 rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            <FaSignOutAlt className="inline mr-2" />
            Logout
          </button>
        )}
      </div>
    </div>
  );
}
