// This is dashboard
import React, { useState, useEffect } from "react";
import {
  FaBox,
  FaClock,
  FaCheck,
  FaExclamationCircle,
  FaMoneyBill,
  FaTrash,
  FaUser,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { useGetDriversQuery } from "../../page/order/redux/api/driverApiSlice";
export default function Delivery() {
  const [deliveries, setDeliveries] = useState([]);
  const [pendingDeliveries, setPendingDeliveries] = useState(0);
  const [completedDeliveries, setCompletedDeliveries] = useState(0);
  const [delayedDeliveries, setDelayedDeliveries] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalDeliveredItems, setTotalDeliveredItems] = useState(0);
  const [totalDrivers, setTotalDrivers] = useState(0);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Price formatter for LKR
  const priceFormatter = new Intl.NumberFormat("en-LK", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  //count driver function call driver api
  const { data: drivers } = useGetDriversQuery();

  useEffect(() => {
    if (drivers) {
      setTotalDrivers(drivers.length);
    }
  }, [drivers]);

  const fetchDeliveries = async () => {
    try {
      const response = await fetch("/api/deliveries");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      console.log(data);
      setDeliveries(data);

      const pending = data.filter((d) => d.deliveryStatus === "Pending").length;
      const completed = data.filter(
        (d) => d.deliveryStatus === "Completed"
      ).length;
      const delayed = data.filter((d) => d.deliveryStatus === "Delayed").length;

      setPendingDeliveries(pending);
      setCompletedDeliveries(completed);
      setDelayedDeliveries(delayed);

      const totalDeliveryEarnings = data.reduce((sum, delivery) => {
        const deliveryPrice = delivery.deliveryPrice
          ? parseFloat(delivery.deliveryPrice)
          : 0;
        return sum + deliveryPrice;
      }, 0);
      setTotalEarnings(totalDeliveryEarnings);

      const totalItemEarnings = data.reduce((sum, delivery) => {
        const itemsPrice = delivery.itemsPrice
          ? parseFloat(delivery.itemsPrice)
          : 0;
        return sum + itemsPrice;
      }, 0);
      setTotalDeliveredItems(totalItemEarnings);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      setError(error.message);
    }
  };

  const fetchDrivers = async () => {
    try {
      const response = await fetch("/api/drivers");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setTotalDrivers(data.length);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchDeliveries();
    fetchDrivers();
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div
      className={`min-h-screen p-6 lg:p-8 ${
        darkMode ? "dark bg-gray-900" : "bg-gradient-animate"
      }`}
    >
      <header
        className={`${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        } shadow-md rounded-lg p-6 mb-8`}
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, Buddhi</h1>
            <p
              className={`${darkMode ? "text-gray-300" : "text-gray-600"} mt-2`}
            >
              Track and manage your deliveries efficiently
            </p>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${
              darkMode
                ? "bg-yellow-400 text-gray-900"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {darkMode ? <FaSun size={24} /> : <FaMoon size={24} />}
          </button>
        </div>
      </header>

      {error && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8"
          role="alert"
        >
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          key="total-deliveries"
          icon={<FaBox />}
          title="Total Deliveries"
          value={deliveries.length}
          color="green"
          darkMode={darkMode}
        />
        <DashboardCard
          key="pending-deliveries"
          icon={<FaClock />}
          title="Pending Deliveries"
          value={pendingDeliveries}
          color="yellow"
          darkMode={darkMode}
        />
        <DashboardCard
          key="completed-deliveries"
          icon={<FaCheck />}
          title="Completed Deliveries"
          value={completedDeliveries}
          color="blue"
          darkMode={darkMode}
        />
        <DashboardCard
          key="delayed-deliveries"
          icon={<FaExclamationCircle />}
          title="Delayed Deliveries"
          value={delayedDeliveries}
          color="red"
          darkMode={darkMode}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          icon={<FaMoneyBill />}
          title="Total Delivery Earnings"
          value={priceFormatter.format(totalEarnings)}
          color="green"
          darkMode={darkMode}
        />
        <DashboardCard
          icon={<FaMoneyBill />}
          title="Total Item Earnings"
          value={priceFormatter.format(totalDeliveredItems)}
          color="blue"
          darkMode={darkMode}
        />
        <DashboardCard
          icon={<FaMoneyBill />}
          title="Total Earnings"
          value={priceFormatter.format(totalEarnings + totalDeliveredItems)}
          color="indigo"
          darkMode={darkMode}
        />
        <DashboardCard
          icon={<FaUser />}
          title="Total Drivers"
          value={totalDrivers}
          color="purple"
          darkMode={darkMode}
        />
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Recent Deliveries
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">Delivery No</th>
                <th className="px-6 py-3">Items Price</th>
                <th className="px-6 py-3">Delivery Price</th>
                <th className="px-6 py-3">Total Price</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {deliveries
                .slice(-5)
                .reverse()
                .map((delivery) => (
                  <tr
                    key={delivery._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {delivery._id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {priceFormatter.format(delivery.itemsPrice || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {priceFormatter.format(delivery.deliveryPrice || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {priceFormatter.format(
                        (delivery.itemsPrice || 0) +
                          (delivery.deliveryPrice || 0)
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        className="text-red-500 hover:text-red-700"
                        // onClick={() => handleDelete(delivery._id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New NBcoir Section */}
      <div
        className={`${
          darkMode ? "bg-gray-800 text-white" : "bg-blue-600 text-white"
        } py-4 rounded-lg text-center shadow-md`}
      >
        <h3 className="text-lg font-bold">CEY COIR</h3>
        <p className="text-sm">
          Delivering quality coir products to local and global markets.
        </p>
      </div>

      <style jsx>{`
        @keyframes gradientAnimation {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .bg-gradient-animate {
          background: linear-gradient(
            -45deg,
            #ee7752,
            #e73c7e,
            #23a6d5,
            #23d5ab
          );
          background-size: 400% 400%;
          animation: gradientAnimation 15s ease infinite;
        }

        .dark {
          color: #ffffff;
        }

        .dark .bg-white {
          background-color: #1a202c;
        }

        .dark .text-gray-600 {
          color: #a0aec0;
        }

        .dark .text-gray-800 {
          color: #e2e8f0;
        }

        .dark .bg-gray-50 {
          background-color: #2d3748;
        }

        .dark .hover:bg-gray-50:hover {
          background-color: #4a5568;
        }
      `}</style>
    </div>
  );
}

function DashboardCard({ icon, title, value, color, darkMode }) {
  return (
    <div
      className={`${
        darkMode ? "bg-gray-800" : "bg-white"
      } p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg transform hover:scale-105`}
    >
      <div className="flex items-center">
        <div className={`text-4xl text-${color}-500 mr-4`}>{icon}</div>
        <div>
          <h2 className={`text-2xl font-semibold text-${color}-600`}>
            {value}
          </h2>
          <p
            className={`${
              darkMode ? "text-gray-300" : "text-gray-600"
            } text-sm mt-1`}
          >
            {title}
          </p>
        </div>
      </div>
    </div>
  );
}
