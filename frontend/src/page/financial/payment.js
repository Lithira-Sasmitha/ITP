import { useState, useEffect } from "react";
import { FaEnvelope } from "react-icons/fa";
import logo from "../../assets/logo.png";

function Payment() {  
  const [darkMode, setDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`flex flex-col h-screen p-8 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="w-12 h-12 rounded-full mr-4" />
          <h1 className="text-2xl font-bold">Payment</h1>
        </div>
        <div className="text-sm text-gray-500">
          <div className="flex items-center mb-2">
            <FaEnvelope className="mr-2" /> info@example.com
          </div>
          <div>{currentTime.toLocaleTimeString()}</div>
        </div>
      </div>

      {/* Payment Content */}
      <div className="p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Recent Payments</h2>
        <ul>
          <li className="p-3 bg-gray-100 rounded-lg mb-2">Electric Bill - $100</li>
          <li className="p-3 bg-gray-100 rounded-lg mb-2">Rent - $1200</li>
          <li className="p-3 bg-gray-100 rounded-lg mb-2">Internet - $50</li>
          <li className="p-3 bg-gray-100 rounded-lg mb-2">Miscellaneous - $75</li>
        </ul>
      </div>

      {/* Toggle Dark Mode */}
      <div className="mt-6">
        <button 
          className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
          onClick={() => setDarkMode(!darkMode)}
        >
          Toggle {darkMode ? "Light" : "Dark"} Mode
        </button>
      </div>
    </div>
  );
}

export default Payment;
