import { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { FaUser, FaBook, FaChartBar, FaEnvelope, FaCog, FaSignOutAlt } from "react-icons/fa";
import logo from "../../assets/logo.png";

function Massege() {  
  const [darkMode, setDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex h-screen bg-gray-150">
      {/* Sidebar */}
      <div className="w-64 bg-green-900 text-white p-5 flex flex-col justify-between shadow-lg">
        <div>
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Logo" className="w-16 h-16 rounded-full" />
          </div>
          <nav>
            <ul>
              <li className="mb-4">
                <button onClick={() => navigate("/dashboard")} className="flex items-center w-full p-3 rounded-lg hover:bg-green-700">
                  <FaChartBar className="mr-4" /> Dashboard
                </button>
              </li>
              <li className="mb-4">
                <button onClick={() => navigate("/income")} className="flex items-center w-full p-3 rounded-lg hover:bg-green-700">
                  <FaBook className="mr-4" /> Income
                </button>
              </li>
              <li className="mb-4">
                <button onClick={() => navigate("/expenses")} className="flex items-center w-full p-3 rounded-lg hover:bg-green-700">
                  <FaUser className="mr-4" /> Expenses
                </button>
              </li>
              <li className="mb-4">
                <button onClick={() => navigate("/salary")} className="flex items-center w-full p-3 rounded-lg hover:bg-green-700">
                  <FaCog className="mr-4" /> Salary
                </button>
              </li>
              <li className="mb-4">
                <button onClick={() => navigate("/Payment")} className="flex items-center w-full p-3 rounded-lg hover:bg-green-700">
                  <FaCog className="mr-4" /> Payment
                </button>
              </li>
              <li className="mb-4">
                <button onClick={() => navigate("/massege")} className="flex items-center w-full p-3 rounded-lg  bg-red-600 hover:bg-red-500">
                  <FaCog className="mr-4" /> Chat
                </button>
              </li>
            </ul>
          </nav>
        </div>
        <div className="text-sm text-gray-400">
          <div className="flex items-center mb-2">
            <FaEnvelope className="mr-2" /> info@example.com
          </div>
          <div>{currentTime.toLocaleTimeString()}</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-8">
        <h1 className="text-2xl font-bold mb-6">Chat</h1>
        
        </div>
        
    
    </div>
  );
}

export default Massege;  