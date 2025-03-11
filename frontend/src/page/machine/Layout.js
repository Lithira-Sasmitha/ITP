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
      <div className="h-screen w-64 p-5 flex flex-col justify-between bg-green-700 text-white shadow-lg">
        <div>
          {/* Logo Section */}
          <div className="flex justify-center mb-8">
            <img
              src={logo}
              alt="Logo"
              className="w-20 h-20 rounded-full border-4 border-white"
            />
          </div>

          {/* Menu Section (Blends with Sidebar, No White Background) */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-white">Menu</h2>
            <nav>
              <ul>
                <li className="mb-4">
                  <button
                    onClick={() => handleNavigate("/dashboard")}
                    className="flex items-center w-full text-left rounded-lg px-4 py-3 transition-all duration-300 bg-green-600 hover:bg-green-500"
                  >
                    <FaListAlt className="h-6 w-6 mr-4 text-white" />
                    Dashboard
                  </button>
                </li>

                <li className="mb-4">
                  <button
                    onClick={toggleDeliveryDropdown}
                    className="flex items-center w-full text-left rounded-lg px-4 py-3 transition-all duration-300 bg-green-600 hover:bg-green-500"
                  >
                    <FaTruck className="h-6 w-6 mr-4 text-white" />
                    Deliveries
                  </button>
                  {isDeliveryOpen && (
                    <ul className="ml-4 mt-2 space-y-1 bg-green-500 rounded-lg">
                      <li>
                        <button
                          onClick={() => handleNavigate("deliverydetail")}
                          className="flex items-center rounded-lg px-4 py-2 transition-all duration-300 hover:bg-green-400"
                        >
                          <FaPlusCircle className="h-6 w-6 mr-4 text-white" />
                          Delivery Details
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleNavigate("adddelivery")}
                          className="flex items-center rounded-lg px-4 py-2 transition-all duration-300 hover:bg-green-400"
                        >
                          <FaPlusCircle className="h-6 w-6 mr-4 text-white" />
                          Add Delivery
                        </button>
                      </li>
                    </ul>
                  )}
                </li>

                <li className="mb-4">
                  <button
                    onClick={() => handleNavigate("drivervehicledetails")}
                    className="flex items-center rounded-lg px-4 py-3 transition-all duration-300 bg-green-600 hover:bg-green-500"
                  >
                    <FaTasks className="h-6 w-6 mr-4 text-white" />
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
                    className="flex items-center rounded-lg px-4 py-3 transition-all duration-300 bg-green-600 hover:bg-green-500"
                  >
                    <FaCog className="h-6 w-6 mr-4 text-white" />
                    Settings
                  </button>
                </li>

                <li className="mb-4">
                  <button
                    onClick={() => handleNavigate("logout")}
                    className="flex items-center rounded-lg px-4 py-3 transition-all duration-300 bg-red-500 hover:bg-red-600"
                  >
                    <FaSignOutAlt className="h-6 w-6 mr-4 text-white" />
                    Logout
                  </button>
                </li>

                <li className="mb-4">
                  <button
                    onClick={toggleDarkMode}
                    className="flex items-center w-full rounded-lg px-4 py-3 transition-all duration-300 bg-green-500 hover:bg-green-400 text-white"
                  >
                    {darkMode ? (
                      <FaSun className="h-6 w-6 mr-4" />
                    ) : (
                      <FaMoon className="h-6 w-6 mr-4" />
                    )}
                    {darkMode ? "Light Mode" : "Dark Mode"}
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-white">
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
      <div className="flex-grow bg-green-50 text-black">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;