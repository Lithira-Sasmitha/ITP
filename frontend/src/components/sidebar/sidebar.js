import { BarChart2, DollarSign, Menu, Settings, ShoppingBag, ShoppingCart, TrendingUp } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

const SIDEBAR_ITEMS = [
  { name: "Dashboard", icon: BarChart2, color: "#ffffff", href: "/" },
  { name: "Income", icon: ShoppingBag, color: "#ffffff", href: "/income" },
  { name: "Expense", icon: DollarSign, color: "#ffffff", href: "/expense" },
  { name: "Salary", icon: ShoppingCart, color: "#ffffff", href: "/salary" },
  { name: "Payment", icon: TrendingUp, color: "#ffffff", href: "/payment" },
  
];

const Sidebar = () => {
  return (
    <motion.div
      className="relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 h-full bg-green-700 text-white shadow-lg w-64"
    >
      <div className="h-full p-5 flex flex-col justify-between">
	  

        {/* Logo Section */}
        <div className="flex justify-center mb-8">
          <img
            src={logo}
            alt="Logo"
            className="rounded-full border-4 border-white w-20 h-20"
          />
        </div>
		<h2 className="text-2xl font-bold mb-6 text-white">Menu</h2>
        {/* Menu Items */}
        <nav className="mt-8 flex-grow">
          {SIDEBAR_ITEMS.map((item) => (
            <Link key={item.href} to={item.href}>
              <motion.div className="flex items-center rounded-lg px-4 py-3 transition-all duration-300 bg-green-600 hover:bg-green-500 mb-2">
                <item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
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
        </nav>
      </div>
    </motion.div>
  );
};

export default Sidebar;