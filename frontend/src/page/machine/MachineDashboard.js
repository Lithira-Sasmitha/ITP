import React, { useState, useEffect } from "react";
import { FaWrench, FaTools, FaChartLine, FaMoon, FaSun } from "react-icons/fa";
import { useGetMachinesQuery } from "../../page/machine/redux/api/machineapiSlice";

export default function Dashboard() {
  // Use Redux query hook to get machine data
  const { data: machines = [], isLoading, isError } = useGetMachinesQuery();
  
  const [darkMode, setDarkMode] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);
  const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500"];

  // Filter machines with "Active" status
  const activeMachines = machines.filter(m => m.status === "Active").length;
  
  // Calculate maintenance due machines
  const maintenanceDue = machines.filter(m => {
    if (!m.warrantyDate) return false;
    const warrantyDate = new Date(m.warrantyDate);
    const currentDate = new Date();
    // Consider maintenance due if within 30 days of warranty expiration
    return warrantyDate > currentDate && 
           (warrantyDate - currentDate) / (1000 * 60 * 60 * 24) <= 30;
  }).length;
  
  // Calculate machine utilization (assuming this data would come from your API)
  const machineUtilization = machines.map(m => ({
    name: m.name,
    utilization: m.utilizationPercentage || 0 // Fallback to 0 if not available
  }));

  const averageUtilization = machines.length > 0 
    ? Math.round(machineUtilization.reduce((sum, m) => sum + m.utilization, 0) / machines.length) 
    : 0;

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // For debugging - can be removed in production
  useEffect(() => {
    if (machines.length > 0) {
      console.log("Total machines:", machines.length);
      console.log("Active machines:", activeMachines);
      console.log("Machine statuses:", machines.map(m => m.status));
    }
  }, [machines, activeMachines]);

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-gray-100'} shadow-md rounded-2xl p-6 mb-8`}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl text-blue-500">Welcome back, Dewmi</h1>
            <h1 className="text-3xl font-bold">Product & Machine Management Dashboard</h1>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-2`}>Monitor and manage products & machines</p>
          </div>
          <button onClick={toggleDarkMode} className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-600'}`}>
            {darkMode ? <FaSun size={24} /> : <FaMoon size={24} />}
          </button>
        </div>
      </header>

      {isLoading ? (
        <div className="text-center py-8">Loading machine data...</div>
      ) : isError ? (
        <div className="text-center py-8 text-red-500">Error loading machine data</div>
      ) : (
        <>
          {/* Dashboard Cards with Color Changing Effect */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 text-black">
            <DashboardCard 
              icon={<FaTools />} 
              title="Total Machines" 
              value={machines.length} 
              bgColor="bg-blue-100" 
              textColor="text-black" // Set text color to black
            />
            <DashboardCard 
              icon={<FaWrench />} 
              title="Active Machines" 
              value={activeMachines} 
              bgColor="bg-blue-100" 
              textColor="text-black" // Set text color to black
            />
            <DashboardCard 
              icon={<FaWrench />} 
              title="Maintenance Due" 
              value={maintenanceDue} 
              bgColor="bg-blue-100" 
              textColor="text-black" // Set text color to black
            />
            <DashboardCard 
              icon={<FaChartLine />} 
              title="Utilization" 
              value={`${averageUtilization}%`} 
              bgColor="bg-blue-100" 
              textColor="text-black" // Set text color to black
            />
          </div>

          {/* Machine Status Breakdown */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-100'} shadow-md rounded-2xl p-6 mb-8`}>
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-4`}>Machine Status Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-100 p-4 rounded-lg border border-green-200">
                <h3 className="text-green-800 font-medium text-lg">Active Machines</h3>
                <div className="flex items-center mt-2">
                  <div className="text-3xl font-bold text-green-600">{activeMachines}</div>
                  <div className="ml-2 text-sm text-green-700">
                    ({machines.length > 0 ? Math.round((activeMachines / machines.length) * 100) : 0}% of total)
                  </div>
                </div>
              </div>
              <div className="bg-red-100 p-4 rounded-lg border border-red-200">
                <h3 className="text-red-800 font-medium text-lg">Inactive Machines</h3>
                <div className="flex items-center mt-2">
                  <div className="text-3xl font-bold text-red-600">{machines.length - activeMachines}</div>
                  <div className="ml-2 text-sm text-red-700">
                    ({machines.length > 0 ? Math.round(((machines.length - activeMachines) / machines.length) * 100) : 0}% of total)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Utilization Section */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-100'} shadow-md rounded-2xl p-6 mt-8`}>
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-4`}>Machine Utilization Chart</h2>
            {/* Placeholder for future chart component */}
            <div className="h-64 flex items-center justify-center border border-dashed rounded-lg">
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Reusable Dashboard Card Component
function DashboardCard({ icon, title, value, bgColor, textColor }) {
  return (
    <div className={`${bgColor} p-6 rounded-2xl shadow-md ${textColor} flex items-center transition-all duration-1000 ease-in-out`}>
      <div className="text-4xl mr-4">{icon}</div>
      <div>
        <h2 className="text-2xl font-semibold">{value}</h2>
        <p className="text-sm mt-1">{title}</p>
      </div>
    </div>
  );
}