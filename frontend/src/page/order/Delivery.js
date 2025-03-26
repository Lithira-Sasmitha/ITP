import Oderslidebar from "../../components/sidebar/oderslidebar";
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
  FaHistory,
} from "react-icons/fa";
import { useGetDriversQuery } from "../../page/order/redux/api/driverApiSlice";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

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
  const [orderHistoryData, setOrderHistoryData] = useState({
    totalDeliveryEarnings: 0,
    totalItemEarnings: 0,
    totalEarnings: 0,
  });

  const priceFormatter = new Intl.NumberFormat("en-LK", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

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
      setDeliveries(data);

      setPendingDeliveries(
        data.filter((d) => d.deliveryStatus === "Pending").length
      );
      setCompletedDeliveries(
        data.filter((d) => d.deliveryStatus === "Completed").length
      );
      setDelayedDeliveries(
        data.filter((d) => d.deliveryStatus === "Delayed").length
      );

      const totalDeliveryEarnings = data.reduce(
        (sum, d) => sum + (parseFloat(d.deliveryPrice) || 0),
        0
      );
      const totalItemEarnings = data.reduce(
        (sum, d) => sum + (parseFloat(d.itemsPrice) || 0),
        0
      );

      setTotalEarnings(totalDeliveryEarnings);
      setTotalDeliveredItems(totalItemEarnings);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      setError(error.message);
    }
  };

  const fetchOrderHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/orders/pending`);
      const orders = response.data;

      const deliveryEarnings = orders.reduce(
        (sum, o) => sum + (parseFloat(o.deliveryPrice) || 0),
        0
      );
      const itemEarnings = orders.reduce(
        (sum, o) =>
          sum +
          o.products.reduce((ps, p) => ps + (p.price * p.quantity || 0), 0),
        0
      );

      setOrderHistoryData({
        totalDeliveryEarnings: deliveryEarnings,
        totalItemEarnings: itemEarnings,
        totalEarnings: deliveryEarnings + itemEarnings,
      });
    } catch (error) {
      console.error("Error fetching order history:", error);
      setError("Failed to load order history earnings data.");
    }
  };

  useEffect(() => {
    fetchDeliveries();
    fetchOrderHistory();
  }, []);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div
      className={`flex h-screen ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white"
          : "bg-gradient-to-br from-gray-100 to-gray-50 text-gray-900"
      } transition-all duration-500`}
    >
      <div
        className={`w-[260px] h-screen shadow-2xl z-10 ${
          darkMode ? "bg-gray-800" : "bg-white"
        } transition-colors duration-300`}
      >
        <Oderslidebar />
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        {/* Header */}
        <div
          className={`flex justify-between items-center p-6 rounded-3xl shadow-2xl transition-all duration-500 ${
            darkMode
              ? "bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700"
              : "bg-gradient-to-r from-white to-gray-50 border border-gray-200"
          }`}
        >
          <div>
            <h1 className="text-4xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Order & Deliver Dashboard
            </h1>
            <p
              className={`text-md transition-colors duration-300 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Order & Delivery Management Overview
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className={`p-3 rounded-full transition-all duration-300 transform hover:rotate-12 hover:scale-110 ${
                darkMode
                  ? "bg-yellow-500 text-gray-900 hover:bg-yellow-400"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {darkMode ? <FaSun size={24} /> : <FaMoon size={24} />}
            </button>
          </div>
        </div>

        {/* Dashboard Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <DashboardCard
            icon={<FaBox />}
            title="Total Deliveries"
            value={deliveries.length}
            color="emerald"
            darkMode={darkMode}
          />
          <DashboardCard
            icon={<FaClock />}
            title="Pending"
            value={pendingDeliveries}
            color="amber"
            darkMode={darkMode}
          />
          <DashboardCard
            icon={<FaCheck />}
            title="Completed"
            value={completedDeliveries}
            color="blue"
            darkMode={darkMode}
          />
          <DashboardCard
            icon={<FaExclamationCircle />}
            title="Delayed"
            value={delayedDeliveries}
            color="rose"
            darkMode={darkMode}
          />
        </div>

        {/* Earnings Section */}
        <div
          className={`p-6 rounded-3xl shadow-2xl transition-all duration-500 ${
            darkMode
              ? "bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700"
              : "bg-gradient-to-r from-white to-gray-50 border border-gray-200"
          }`}
        >
          <div className="flex items-center mb-6 space-x-3">
            <FaHistory className="text-2xl text-indigo-500" />
            <h2 className="text-2xl font-semibold">Earnings Overview</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <EarningsCard
              title="Delivery Earnings"
              value={priceFormatter.format(
                orderHistoryData.totalDeliveryEarnings
              )}
              icon={<FaMoneyBill />}
              color="green"
              darkMode={darkMode}
            />
            <EarningsCard
              title="Item Earnings"
              value={priceFormatter.format(orderHistoryData.totalItemEarnings)}
              icon={<FaMoneyBill />}
              color="blue"
              darkMode={darkMode}
            />
            <EarningsCard
              title="Total Earnings"
              value={priceFormatter.format(orderHistoryData.totalEarnings)}
              icon={<FaMoneyBill />}
              color="indigo"
              darkMode={darkMode}
            />
          </div>
        </div>

        {/* Recent Deliveries Table */}
        <div
          className={`rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 ${
            darkMode
              ? "bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700"
              : "bg-gradient-to-r from-white to-gray-50 border border-gray-200"
          }`}
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold">Recent Deliveries</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                <tr className="text-xs uppercase tracking-wider text-left">
                  <th className="p-4">Delivery No</th>
                  <th className="p-4">Items Price</th>
                  <th className="p-4">Delivery Price</th>
                  <th className="p-4">Total Price</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {deliveries
                  .slice(-5)
                  .reverse()
                  .map((d) => (
                    <tr
                      key={d._id}
                      className={`border-b transition-colors duration-300 hover:${
                        darkMode
                          ? "bg-gray-700 bg-opacity-50"
                          : "bg-gray-50 bg-opacity-70"
                      }`}
                    >
                      <td className="p-4">{d._id}</td>
                      <td className="p-4">
                        {priceFormatter.format(d.itemsPrice || 0)}
                      </td>
                      <td className="p-4">
                        {priceFormatter.format(d.deliveryPrice || 0)}
                      </td>
                      <td className="p-4">
                        {priceFormatter.format(
                          (d.itemsPrice || 0) + (d.deliveryPrice || 0)
                        )}
                      </td>
                      <td className="p-4">
                        <button className="text-red-500 hover:text-red-700 transition-colors transform hover:scale-125">
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ icon, title, value, color, darkMode }) {
  return (
    <div
      className={`p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 ${
        darkMode
          ? `bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700`
          : `bg-gradient-to-r from-white to-gray-50 border border-gray-200`
      }`}
    >
      <div className="flex items-center space-x-4">
        <div className={`text-4xl text-${color}-500`}>{icon}</div>
        <div>
          <h2 className={`text-3xl font-bold text-${color}-600`}>{value}</h2>
          <p
            className={`text-sm transition-colors duration-300 ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {title}
          </p>
        </div>
      </div>
    </div>
  );
}

function EarningsCard({ title, value, icon, color, darkMode }) {
  return (
    <div
      className={`p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 ${
        darkMode
          ? `bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700`
          : `bg-gradient-to-r from-white to-gray-50 border border-gray-200`
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p
            className={`text-sm mb-2 transition-colors duration-300 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {title}
          </p>
          <h3 className={`text-2xl font-bold text-${color}-500`}>
            Rs. {value}
          </h3>
        </div>
        <div className={`text-3xl text-${color}-500`}>{icon}</div>
      </div>
    </div>
  );
}
