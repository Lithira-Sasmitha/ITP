import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import {
  FaTruck,
  FaCog,
  FaSignOutAlt,
  FaListAlt,
  FaPlusCircle,
  FaTasks,
  FaMoon,
  FaSun,
  FaEnvelope,
  FaPhone,
  FaClock,
} from "react-icons/fa";
import logo from "../../assets/logo.png"; // ✅ Corrected import path

function Layout() {
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleDeliveryDropdown = () => {
    setIsDeliveryOpen(!isDeliveryOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="flex flex-col justify-between w-64 h-screen p-5 text-white bg-green-700 shadow-lg">
        <div>
          {/* Logo Section */}
          <div className="flex justify-center mb-8">
            <img
              src={logo}
              alt="Logo"
              className="w-20 h-20 border-4 border-white rounded-full"
            />
          </div>

          {/* Menu Section (Blends with Sidebar, No White Background) */}
          <div className="mb-8">
            <h2 className="mb-6 text-2xl font-bold text-white">Menu</h2>
            <nav>
              <ul>
                <li className="mb-4">
                  <button
                    onClick={() => handleNavigate("/dashboard")}
                    className="flex items-center w-full px-4 py-3 text-left transition-all duration-300 bg-green-600 rounded-lg hover:bg-green-500"
                  >
                    <FaListAlt className="w-6 h-6 mr-4 text-white" />
                    Dashboard
                  </button>
                </li>

                <li className="mb-4">
                  <button
                    onClick={toggleDeliveryDropdown}
                    className="flex items-center w-full px-4 py-3 text-left transition-all duration-300 bg-green-600 rounded-lg hover:bg-green-500"
                  >
                    <FaTruck className="w-6 h-6 mr-4 text-white" />
                    Deliveries
                  </button>
                  {isDeliveryOpen && (
                    <ul className="mt-2 ml-4 space-y-1 bg-green-500 rounded-lg">
                      <li>
                        <button
                          onClick={() => handleNavigate("deliverydetail")}
                          className="flex items-center px-4 py-2 transition-all duration-300 rounded-lg hover:bg-green-400"
                        >
                          <FaPlusCircle className="w-6 h-6 mr-4 text-white" />
                          Delivery Details
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleNavigate("adddelivery")}
                          className="flex items-center px-4 py-2 transition-all duration-300 rounded-lg hover:bg-green-400"
                        >
                          <FaPlusCircle className="w-6 h-6 mr-4 text-white" />
                          Add Delivery
                        </button>
                      </li>
                    </ul>
                  )}
                </li>

                <li className="mb-4">
                  <button
                    onClick={() => handleNavigate("drivervehicledetails")}
                    className="flex items-center px-4 py-3 transition-all duration-300 bg-green-600 rounded-lg hover:bg-green-500"
                  >
                    <FaTasks className="w-6 h-6 mr-4 text-white" />
                    D & V Details
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          {/* Settings & Logout */}
          <div>
            <nav>
              <ul>
                <li className="mb-4">
                  <button
                    onClick={() => handleNavigate("settings")}
                    className="flex items-center px-4 py-3 transition-all duration-300 bg-green-600 rounded-lg hover:bg-green-500"
                  >
                    <FaCog className="w-6 h-6 mr-4 text-white" />
                    Settings
                  </button>
                </li>

                <li className="mb-4">
                  <button
                    onClick={() => handleNavigate("logout")}
                    className="flex items-center px-4 py-3 transition-all duration-300 bg-red-500 rounded-lg hover:bg-red-600"
                  >
                    <FaSignOutAlt className="w-6 h-6 mr-4 text-white" />
                    Logout
                  </button>
                </li>

                <li className="mb-4">
                  <button
                    onClick={toggleDarkMode}
                    className="flex items-center w-full px-4 py-3 text-white transition-all duration-300 bg-green-500 rounded-lg hover:bg-green-400"
                  >
                    {darkMode ? (
                      <FaSun className="w-6 h-6 mr-4" />
                    ) : (
                      <FaMoon className="w-6 h-6 mr-4" />
                    )}
                    {darkMode ? "Light Mode" : "Dark Mode"}
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 mt-8 border-t border-white">
          <div className="flex items-center mb-2 text-white">
            <FaEnvelope className="mr-2" />
            <span className="text-sm">info@jayasinghe.com</span>
          </div>
          <div className="flex items-center mb-2 text-white">
            <FaPhone className="mr-2" />
            <span className="text-sm">+94 11 234 5678</span>
          </div>
          <div className="flex items-center text-white">
            <FaClock className="mr-2" />
            <span className="text-sm">{currentTime.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow text-black bg-green-50">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;