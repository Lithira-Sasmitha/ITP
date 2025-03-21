import { FaEnvelope } from "react-icons/fa";
import { FiZap, FiUsers, FiShoppingBag, FiBarChart2 } from "react-icons/fi";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import { getTotal } from '../../components/helper/helper';
import StatCard from "../../components/statCard/statCard"; 
import Header from "../../components/header/header";
import { default as api } from '../../store/apiSLice'; 

const salesData = [
  { name: "Jul", sales: 4200 },
  { name: "Aug", sales: 3800 },
  { name: "Sep", sales: 5100 },
  { name: "Oct", sales: 4600 },
  { name: "Nov", sales: 5400 },
  { name: "Dec", sales: 7200 },
  { name: "Jan", sales: 6100 },
  { name: "Feb", sales: 5900 },
  { name: "Mar", sales: 6800 },
  { name: "Apr", sales: 6300 },
  { name: "May", sales: 7100 },
  { name: "Jun", sales: 7500 },
];

const Dashboard = () => {
  const { data, isFetching, isSuccess } = api.useGetLabelsQuery();

  // Default values while loading
  const totalIncome = isSuccess ? `$${getTotal(data).toLocaleString()}` : '$0';
  const totalExpense = isSuccess ? `$${data.reduce((acc, item) => acc + item.amount, 0).toLocaleString()}` : '$0';
  const conversionRate = isSuccess ? `${((getTotal(data) / 10000) * 100).toFixed(2)}%` : '0%';

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Dashboard" />
      
      <main className="w-full px-2 sm:px-4 lg:px-6 py-6 sm:py-10 lg:py-20">
        {/* STATS SECTION - Responsive at all breakpoints */}
        <motion.div
          className="w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5 mb-5 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-full">
            <StatCard name="Total Income" icon={FiZap} value={totalIncome} color="#6366F1" />
          </div>
          <div className="w-full">
            <StatCard name="Expense" icon={FiUsers} value={totalExpense} color="#8B5CF6" />
          </div>
          <div className="w-full sm:col-span-2 lg:col-span-1">
            <StatCard name="Conversion Rate" icon={FiBarChart2} value={conversionRate} color="#10B981" />
          </div>
        </motion.div>

        {/* SALES CHART SECTION - Responsive at all breakpoints */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Sales Overview Box */}
          <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-4 sm:p-5 lg:p-6 border border-gray-700 w-full h-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="text-base sm:text-lg font-medium mb-3 sm:mb-4 text-gray-100">Sales Overview</h2>

            <div className="h-60 sm:h-72 lg:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#9ca3af" 
                    tick={{ fontSize: 12 }}
                    tickMargin={8}
                  />
                  <YAxis 
                    stroke="#9ca3af" 
                    tick={{ fontSize: 12 }}
                    tickMargin={8}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(31, 41, 55, 0.8)",
                      borderColor: "#4B5563",
                    }}
                    itemStyle={{ color: "#E5E7EB" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#6366F1"
                    strokeWidth={2}
                    dot={{ fill: "#6366F1", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Category Distribution Box */}
          <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-4 sm:p-5 lg:p-6 border border-gray-700 w-full h-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2 className="text-base sm:text-lg font-medium mb-3 sm:mb-4 text-gray-100">Category Distribution</h2>
            <div className="h-60 sm:h-72 lg:h-80 flex items-center justify-center">
              <p className="text-gray-400">Category data visualization will appear here</p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;