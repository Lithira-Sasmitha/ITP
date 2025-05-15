import { User, Settings, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const SIDEBAR_ITEMS = [
  { name: "Profile Board", icon: User, href: "/employeeProfileDashboard" },
  { name: "Edit Profile", icon: Settings, href: "/e_userprofile" },
  { name: "Attendance", icon: User, href: "/employeeAttendance" },
  { name: "Leave Request", icon: User, href: "/requestedleave" },
];

const ProfileSidebar = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("currentuser"));
    if (userData && userData.role) {
      setUserRole(userData.role);
    }
  }, []);

  const handleProfileClick = () => {
    if (userRole === "Financial manager") {
      navigate("/financialdashboard");
    } else if (userRole === "Inventory manager") {
      navigate("/inventory/dashboard");
    } else if (userRole === "Oder manager") {
      navigate("/DeliverHome");
    } else if (userRole === "Employee manager") {
      navigate("/employeeDashboard");
    } else if (userRole === "Machine manager") {
      navigate("/machinedashboard");
    } else {
      navigate("/employeeDashboard"); // Default fallback
    }
  };

  const handleLogout = () => {
    // Clear localStorage or user session if needed
    navigate("/signin");
  };

  return (
    <motion.div className="relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 h-full bg-green-700 text-white shadow-lg w-64">
      <div className="h-full p-5 flex flex-col justify-between">
        {/* Profile Icon */}
        <div className="flex justify-center mb-8">
          <motion.div
            className="bg-green-600 p-4 rounded-full hover:bg-green-500 transition cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleProfileClick}
          >
            <User size={40} color="white" />
          </motion.div>
        </div>

        {/* Menu Title */}
        <h2 className="text-2xl font-bold mb-6 text-white text-center">
          My Profile
        </h2>

        {/* Menu Buttons */}
        <nav className="flex-grow">
          {SIDEBAR_ITEMS.map((item) => (
            <Link key={item.href} to={item.href}>
              <motion.div className="flex items-center rounded-lg px-4 py-3 transition-all duration-300 bg-green-600 hover:bg-green-500 mb-4">
                <item.icon size={20} className="text-white" />
                <motion.span
                  className="ml-4 whitespace-nowrap"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2, delay: 0.3 }}
                >
                  {item.name}
                </motion.span>
              </motion.div>
            </Link>
          ))}

          {/* Logout Button */}
          <motion.div
            className="flex items-center rounded-lg px-4 py-3 transition-all duration-300 bg-red-600 hover:bg-red-500 mb-4 cursor-pointer"
            onClick={handleLogout}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut size={20} className="text-white" />
            <motion.span
              className="ml-4 whitespace-nowrap"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2, delay: 0.3 }}
            >
              Logout
            </motion.span>
          </motion.div>
        </nav>
      </div>
    </motion.div>
  );
};

export default ProfileSidebar;
