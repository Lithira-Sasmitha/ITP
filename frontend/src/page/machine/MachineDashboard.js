import React, { useState, useEffect } from "react";
import {
  FaWrench,
  FaTools,
  FaChartLine,
  FaMoon,
  FaSun,
  FaIndustry,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useGetMachinesQuery } from "../../page/machine/redux/api/machineapiSlice";
import Machinesidebar from "../../components/sidebar/Machinesidebar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

export default function MachineDashboard() {
  const { data: machinesData, isLoading } = useGetMachinesQuery();
  const [darkMode, setDarkMode] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const machines = Array.isArray(machinesData?.data) ? machinesData.data : [];

  const activeMachines = machines.filter((m) => m.status === "Active").length;
  const inactiveMachines = machines.length - activeMachines;

  const maintenanceDue = machines.filter((m) => {
    if (!m.warrantyDate) return false;
    const warrantyDate = new Date(m.warrantyDate);
    const currentDate = new Date();
    return (
      warrantyDate > currentDate &&
      (warrantyDate - currentDate) / (1000 * 60 * 60 * 24) <= 30
    );
  }).length;

  const averageUtilization =
    machines.length > 0
      ? Math.round(
          machines.reduce((sum, m) => {
            const utilization =
              m.status === "Active" ? 80 : m.status === "Inactive" ? 20 : 0;
            return sum + utilization;
          }, 0) / machines.length
        )
      : 0;

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const lowUtilizationMachines = machines.filter((m) => {
    const utilization =
      m.status === "Active" ? 80 : m.status === "Inactive" ? 20 : 0;
    return utilization < 30;
  });

  const showUtilizationAlert = lowUtilizationMachines.length > 0;

  // Control alert visibility
  useEffect(() => {
    if (showUtilizationAlert) {
      setShowAlert(true);
      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => setShowAlert(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showUtilizationAlert]);

  const handleDismissAlert = () => {
    setShowAlert(false);
  };

  const chartData = machines.map((m) => ({
    name: m.name || m._id,
    Utilization: m.status === "Active" ? 80 : m.status === "Inactive" ? 20 : 0,
  }));

  return (
    <div
      className={`min-h-screen flex ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100"
          : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-900"
      } transition-colors duration-300`}
    >
      {/* Sidebar */}
      <div className="fixed z-40 h-screen w-72 shadow-2xl">
        <Machinesidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-8">
        <div
          className={`${
            darkMode
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          } rounded-3xl shadow-2xl overflow-hidden`}
        >
          {/* Header */}
          <header className="bg-gray-200 text-black p-8 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-3 tracking-tight text-gray-900">
                Welcome Product & Machine Management Dashboard
              </h1>
              <p className="text-lg opacity-80 font-light text-black-900">
                Comprehensive insights into your machine ecosystem
              </p>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`p-3 rounded-full transition-all duration-300 ${
                darkMode
                  ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {darkMode ? <FaSun size={28} /> : <FaMoon size={28} />}
            </button>
          </header>

          {isLoading ? (
            <LoadingState />
          ) : (
            <div className="p-8 space-y-8">
              {/* Utilization Alert */}
              {showUtilizationAlert && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
                  <p className="font-semibold">
                    Reminder: {lowUtilizationMachines.length} machine(s) have
                    utilization below 30%. Consider taking action to improve
                    performance.
                  </p>
                </div>
              )}
              {showAlert && (
                <div className="fixed top-4 right-4 z-50 max-w-sm bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-lg flex items-center space-x-2 animate-slide-in">
                  <FaExclamationTriangle className="text-red-700 w-5 h-5" />
                  <p className="font-semibold">
                    {lowUtilizationMachines.length} machine(s) have utilization
                    below 30%. Consider taking action to improve performance.
                  </p>
                  <button
                    onClick={handleDismissAlert}
                    className="text-red-700 hover:text-red-900 focus:outline-none"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                  icon={<FaIndustry />}
                  title="Total Machines"
                  value={machines.length}
                />
                <MetricCard
                  icon={<FaTools />}
                  title="Active Machines"
                  value={activeMachines}
                />
                <MetricCard
                  icon={<FaWrench />}
                  title="Maintenance Due"
                  value={maintenanceDue}
                />
                <MetricCard
                  icon={<FaChartLine />}
                  title="Avg. Utilization"
                  value={`${averageUtilization}%`}
                />
              </div>

              {/* Detailed Insights */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Machine Status */}
                <div
                  className={`${
                    darkMode
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-200"
                  } rounded-2xl shadow-lg p-6 border`}
                >
                  <h2 className="text-2xl font-semibold mb-6">
                    Machine Status Overview
                  </h2>
                  <div className="space-y-4">
                    <StatusBar
                      label="Active Machines"
                      value={activeMachines}
                      total={machines.length}
                      color="green"
                      darkMode={darkMode}
                    />
                    <StatusBar
                      label="Inactive Machines"
                      value={inactiveMachines}
                      total={machines.length}
                      color="red"
                      darkMode={darkMode}
                    />
                  </div>
                </div>

                {/* Utilization Chart */}
                <div
                  className={`${
                    darkMode
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border border-gray-200"
                  } rounded-2xl shadow-lg p-6 border`}
                >
                  <h2 className="text-2xl font-semibold mb-6">
                    Utilization Insights
                  </h2>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="Utilization"
                        fill="#3b82f6"
                        radius={[4, 4, 0, 0]}
                      >
                        <LabelList
                          dataKey="Utilization"
                          position="top"
                          fill={darkMode ? "#ffffff" : "#000000"}
                          fontSize={12}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function MetricCard({ icon, title, value }) {
  return (
    <div className="bg-blue-100 text-black rounded-2xl shadow-md p-6 flex items-center space-x-4 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <div className="text-4xl opacity-70">{icon}</div>
      <div>
        <h3 className="text-xl font-medium opacity-80 text-black">{title}</h3>
        <div className="text-3xl font-bold text-black">{value}</div>
      </div>
    </div>
  );
}

function StatusBar({ label, value, total, color, darkMode }) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div>
      <div className="flex justify-between mb-2">
        <span
          className={`${
            darkMode ? `text-${color}-300` : `text-${color}-600`
          } font-medium`}
        >
          {label}
        </span>
        <span
          className={`${
            darkMode ? `text-${color}-300` : `text-${color}-600`
          } font-semibold`}
        >
          {value} ({percentage}%)
        </span>
      </div>
      <div
        className={`w-full h-2 rounded-full ${
          darkMode ? `bg-${color}-900` : `bg-${color}-100`
        } overflow-hidden`}
      >
        <div
          className={`h-full bg-${color}-500`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center h-96 animate-pulse">
      <div className="text-center">
        <div className="text-4xl font-bold text-gray-400 mb-4">
          Loading Dashboard
        </div>
        <div className="text-gray-500">Gathering machine insights...</div>
      </div>
    </div>
  );
}
