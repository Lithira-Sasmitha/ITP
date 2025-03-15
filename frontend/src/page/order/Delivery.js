import React, { useState, useEffect } from "react";
import {
  FaBox,
  FaClock,
  FaCheck,
  FaExclamationCircle,
  FaUser,
  FaCarAlt,
  FaTrash,
  FaSun,
  FaMoon,
} from "react-icons/fa";

import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

export default function Delivery() {
  const [deliveries, setDeliveries] = useState([]);
  const [pendingDeliveries, setPendingDeliveries] = useState(0);
  const [completedDeliveries, setCompletedDeliveries] = useState(0);
  const [delayedDeliveries, setDelayedDeliveries] = useState(0);
  const [totalDrivers, setTotalDrivers] = useState(0);
  const [totalVehicles, setTotalVehicles] = useState(0);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const priceFormatter = new Intl.NumberFormat("en-LK", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const fetchDeliveries = async () => {
    try {
      const response = await fetch("/api/deliveries");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setDeliveries(data);

      const pending = data.filter((d) => d.deliveryStatus === "Pending").length;
      const completed = data.filter(
        (d) => d.deliveryStatus === "Completed"
      ).length;
      const delayed = data.filter((d) => d.deliveryStatus === "Delayed").length;

      setPendingDeliveries(pending);
      setCompletedDeliveries(completed);
      setDelayedDeliveries(delayed);
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

  const fetchVehicles = async () => {
    try {
      const response = await fetch("/api/vehicles");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setTotalVehicles(data.length);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchDeliveries();
    fetchDrivers();
    fetchVehicles();
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const deliveryChartData = {
    labels: ["Pending", "Completed", "Delayed"],
    datasets: [
      {
        label: "Deliveries",
        data: [pendingDeliveries, completedDeliveries, delayedDeliveries],
        borderColor: "#34D399",
        backgroundColor: "rgba(52, 211, 153, 0.2)",
        fill: true,
      },
    ],
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
          icon={<FaUser />}
          title="Total Drivers"
          value={totalDrivers}
          color="purple"
          darkMode={darkMode}
        />
        <DashboardCard
          icon={<FaCarAlt />}
          title="Total Vehicles"
          value={totalVehicles}
          color="blue"
          darkMode={darkMode}
        />
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Delivery Status
          </h2>
        </div>
        <div className="px-6 py-4">
          <Line data={deliveryChartData} />
        </div>
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
                      <button className="text-red-500 hover:text-red-700">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
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
