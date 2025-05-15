import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import {
  FaTruck,
  FaCog,
  FaSignOutAlt,
  FaPlusCircle,
  FaTasks,
  FaMoon,
  FaSun,
  FaHistory,
  FaTachometerAlt,
} from "react-icons/fa";
import logo from "../../assets/logo.png";

function Sidebar() {
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
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="h-full w-[15%] p-5 flex flex-col justify-between bg-green-900 text-white shadow-lg">
        <div>
          {/* Logo Section */}
          <div className="flex justify-center mb-8">
            <img
              src={logo}
              alt="Logo"
              className="w-20 h-20 rounded-full border-4 border-white"
            />
          </div>

          {/* Menu Section */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold mb-6 text-white">Menu</h2>
            <nav>
              <ul>
                <li className="mb-4">
                  <button
                    onClick={() => handleNavigate("/dashboard")}
                    className="flex items-center w-full text-left rounded-lg px-4 py-3 transition-all duration-300 bg-green-900 hover:bg-green-700"
                  >
                    <FaTachometerAlt className="h-6 w-6 mr-4 text-white" />
                    Dashboard
                  </button>
                </li>

                <li className="mb-4">
                  <button
                    onClick={toggleDeliveryDropdown}
                    className="flex items-center w-full text-left rounded-lg px-4 py-3 transition-all duration-300 bg-green-900 hover:bg-green-700"
                  >
                    <FaTruck className="h-6 w-6 mr-4 text-white" />
                    Deliveries
                  </button>
                  {isDeliveryOpen && (
                    <ul className="ml-4 mt-2 space-y-1 bg-green-900 rounded-lg">
                      <li>
                        <button
                          onClick={() => handleNavigate("deliverydetail")}
                          className="w-full flex items-center rounded-lg px-4 py-2 transition-all duration-300 hover:bg-green-700"
                        >
                          <FaPlusCircle className="h-6 w-6 mr-4 text-white" />
                          Delivery Details
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleNavigate("adddelivery")}
                          className="w-full flex items-center rounded-lg px-4 py-2 transition-all duration-300 hover:bg-green-700"
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
                    className="flex items-center w-full text-left rounded-lg px-4 py-3 transition-all duration-300 bg-green-900 hover:bg-green-700"
                  >
                    <FaTasks className="h-6 w-6 mr-4 text-white" />D & V Details
                  </button>
                </li>

                <li className="mb-4">
                  <button
                    onClick={() => handleNavigate("pendingorders")}
                    className="flex items-center w-full text-left rounded-lg px-4 py-3 transition-all duration-300 bg-green-900 hover:bg-green-700"
                  >
                    <FaHistory className="h-6 w-6 mr-4 text-white" />
                    Order History
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
                    className="flex items-center w-full text-left rounded-lg px-4 py-3 transition-all duration-300 bg-green-900 hover:bg-green-700"
                  >
                    <FaCog className="h-6 w-6 mr-4 text-white" />
                    Settings
                  </button>
                </li>

                <div className="fix-bottom ">
                  <li className="mb-4">
                    <button
                      onClick={() => handleNavigate("logout")}
                      className="flex w-full items-center justify-center rounded-lg mt-28 px-4 py-3 transition-all duration-300 bg-red-500 hover:bg-red-600"
                    >
                      <FaSignOutAlt className="h-6 w-6 mr-4 text-white" />
                      Logout
                    </button>
                  </li>
                  <div className="text-white text-center mt-4">
                    <p>{currentTime.toLocaleTimeString()}</p>
                  </div>
                </div>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow bg-green-50 text-black overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default Sidebar;