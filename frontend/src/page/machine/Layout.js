import { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { FaCog, FaSignOutAlt } from "react-icons/fa";
import logo from "../../assets/logo.png";

function Layout() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showProductSubMenu, setShowProductSubMenu] = useState(false);
  const [showMachineSubMenu, setShowMachineSubMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleProductManagementClick = () => {
    setShowProductSubMenu(!showProductSubMenu);
  };

  const handleMachineManagementClick = () => {
    setShowMachineSubMenu(!showMachineSubMenu);
  };

  return (
    <div className="flex h-full bg-gray-150">
      {/* Sidebar */}
      <div className="w-64 bg-green-900 text-white p-5 flex flex-col justify-between shadow-lg">
        <div>
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Logo" className="w-16 h-16 rounded-full" />
          </div>
          <nav>
            <ul>
              <li className="mb-4">
                <button onClick={() => navigate("/menu")} className="flex items-center w-full p-3 rounded-lg hover:bg-green-700">
                  Menu
                </button>
              </li>
              <li className="mb-4">
                <button onClick={() => navigate("/dashboard")} className="flex items-center w-full p-3 rounded-lg hover:bg-green-700">
                  Dashboard
                </button>
              </li>
              <li className="mb-4">
                <button onClick={handleProductManagementClick} className="flex items-center w-full p-3 rounded-lg hover:bg-green-700">
                  Product Management
                </button>
                {showProductSubMenu && (
                  <ul className="ml-6 mt-2">
                    <li className="mb-2">
                      <button onClick={() => navigate("/product-details")} className="w-full p-2 rounded-lg hover:bg-green-600">
                        Product Details
                      </button>
                    </li>
                    <li>
                      <button onClick={() => navigate("/add-product")} className="w-full p-2 rounded-lg hover:bg-green-600">
                        Add Product
                      </button>
                    </li>
                  </ul>
                )}
              </li>
              <li className="mb-4">
                <button onClick={handleMachineManagementClick} className="flex items-center w-full p-3 rounded-lg hover:bg-green-700">
                  Machine Management
                </button>
                {showMachineSubMenu && (
                  <ul className="ml-6 mt-2">
                    <li className="mb-2">
                      <button onClick={() => navigate("/add-machine")} className="w-full p-2 rounded-lg hover:bg-green-600">
                        Add Machine
                      </button>
                    </li>
                    <li className="mb-2">
                      <button onClick={() => navigate("/machine-parts")} className="w-full p-2 rounded-lg hover:bg-green-600">
                        Machine Parts
                      </button>
                    </li>
                    <li>
                      <button onClick={() => navigate("/maintenance")} className="w-full p-2 rounded-lg hover:bg-green-600">
                        Maintenance
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </nav>
        </div>

        {/* Logout button at the bottom */}
        <div>
          <button onClick={() => navigate("/logout")} className="flex items-center w-full p-3 rounded-lg bg-red-600 hover:bg-red-500">
            <FaSignOutAlt className="mr-4" /> Logout
          </button>
          <div className="text-sm text-gray-400 mt-4 text-center">
            {currentTime.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-8">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;