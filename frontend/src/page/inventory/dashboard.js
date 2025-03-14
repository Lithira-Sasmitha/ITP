import { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { FaUser, FaBook, FaChartBar, FaEnvelope, FaCog, FaSignOutAlt } from "react-icons/fa";
import logo from "../../assets/logo.png";

function Dashboard() {  
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
      <div className="flex flex-col justify-between w-64 p-5 text-white bg-green-900 shadow-lg">
        <div>
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Logo" className="w-16 h-16 rounded-full" />
          </div>
          <nav>
            <ul>
              <li className="mb-4">
                <button onClick={() => navigate("/dashboard")} className="flex items-center w-full p-3 bg-red-600 rounded-lg hover:bg-red-500">
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
                <button onClick={() => navigate("/massege")} className="flex items-center w-full p-3 rounded-lg hover:bg-green-700">
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
        <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-6 text-center bg-white rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold">Web Development</h2>
          </div>
          <div className="p-6 text-center bg-white rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold">App Development</h2>
          </div>
          <div className="p-6 text-center bg-white rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold">UX & UI</h2>
          </div>
        </div>
        
        {/* Profile Section */}
        <div className="p-6 mt-8 bg-white rounded-lg shadow-lg">
          <div className="flex items-center mb-4">
            <img src="https://via.placeholder.com/50" alt="Profile" className="w-16 h-16 mr-4 rounded-full" />
            <div>
              <h3 className="text-lg font-semibold">Jhonne Doe</h3>
              <p className="text-gray-500">Teacher</p>
            </div>
          </div>
          <ul>
            <li className="p-3 mb-2 bg-gray-100 rounded-lg">HTML & CSS - 2 Hours</li>
            <li className="p-3 mb-2 bg-gray-100 rounded-lg">JavaScript - 2 Hours</li>
            <li className="p-3 mb-2 bg-gray-100 rounded-lg">React.js - 2 Hours</li>
            <li className="p-3 mb-2 bg-gray-100 rounded-lg">Node.js - 2 Hours</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;  