import React, { useState } from "react";
import {
  BarChart2,
  Settings,
  Package,
  Layers,
  Wrench,
  Hammer,
  Menu,
  User // Import the Menu icon for the hamburger menu
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

const SIDEBAR_ITEMS = [
  {
    name: "Dashboard",
    icon: BarChart2,
    href: "/MachineDashboard",
  },
  {
    name: "Product Management",
    icon: Package,
    subItems: [
      {
        name: "Product Details",
        href: "/product-details",
        icon: Hammer,
      },
    ],
  },
  {
    name: "Machine Management",
    icon: Settings,
    subItems: [
      { name: "Add Machine", href: "/add-machine", icon: Wrench },
      { name: "Machine Parts", icon: Layers, href: "/machine-parts" },
      { name: "Maintenance", icon: Wrench, href: "/maintenance" },
    ],
  },
];

const Machinesidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openMenus, setOpenMenus] = useState({}); // State to track which menu is open

  const hoverVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
      },
    },
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMenu = (menuName) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName], // Toggle the specific menu's open state
    }));
  };

  return (
    <div className="relative">
      {/* Sidebar */}
      <div
        className={`w-64 bg-green-900 text-white p-5 flex flex-col justify-between shadow-lg fixed top-0 bottom-0 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "left-0" : "-left-64"
        }`}
      >
        {/* Profile icon  */}
        <div className="flex justify-center mb-8">
          <Link to="/employeeProfileDashboard">
            <motion.div className="bg-green-600 p-4 rounded-full hover:bg-green-500 transition">
              <User size={40} color="white" />
            </motion.div>
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="flex-grow">
          {SIDEBAR_ITEMS.map((item) => (
            <div key={item.name} className="mb-4">
              {item.subItems ? (
                // Menu items with sub-items (toggle behavior)
                <div
                  onClick={() => toggleMenu(item.name)} // Toggle sub-items visibility on click
                  className="flex items-center px-4 py-3 transition-all duration-300 cursor-pointer"
                >
                  {item.icon && <item.icon className="w-6 h-6 text-white" />}
                  <motion.span
                    className="ml-3 font-medium text-white whitespace-nowrap"
                    variants={hoverVariants}
                    whileHover="hover"
                  >
                    {item.name}
                  </motion.span>
                </div>
              ) : (
                // Menu items without sub-items (button-like behavior)
                <Link to={item.href || "#"}>
                  <motion.div
                    className="flex items-center px-4 py-3 transition-all duration-300 cursor-pointer"
                    variants={hoverVariants}
                    whileHover="hover"
                  >
                    {item.icon && <item.icon className="w-6 h-6 text-white" />}
                    <motion.span className="ml-3 font-medium text-white whitespace-nowrap">
                      {item.name}
                    </motion.span>
                  </motion.div>
                </Link>
              )}
              {item.subItems &&
                openMenus[item.name] && ( // Show sub-items only if the parent is toggled open
                  <div className="ml-6 mt-2 space-y-3">
                    {item.subItems.map((sub) => (
                      <Link key={sub.href} to={sub.href}>
                        <motion.div
                          className="flex items-center px-4 py-2 transition-all duration-300"
                          variants={hoverVariants}
                          whileHover="hover"
                        >
                          {sub.icon && (
                            <sub.icon className="w-5 h-5 text-white/80" />
                          )}
                          <motion.span className="ml-3 text-sm text-white whitespace-nowrap">
                            {sub.name}
                          </motion.span>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </nav>

        {/* Footer Section */}
        <div className="mt-6 pt-4 border-t border-green-600/50">
          <p className="text-xs text-center text-white/70">CeyCoir</p>
        </div>
      </div>

      {/* Toggle Sidebar Button */}
      <button
        className="fixed top-4 left-4 bg-green-600 text-white p-2 rounded-full z-10 hover:bg-green-700 transition-all duration-300"
        onClick={toggleSidebar}
      >
        <Menu className="w-4 h-4" />{" "}
        {/* Reduced the size of the hamburger menu icon */}
      </button>
    </div>
  );
};

export default Machinesidebar;
