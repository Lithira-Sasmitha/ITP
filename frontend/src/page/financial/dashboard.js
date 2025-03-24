import { FaEnvelope } from "react-icons/fa";
import { FiZap, FiUsers, FiShoppingBag, FiBarChart2 } from "react-icons/fi";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import { getTotal, getIncomeTotal, getExpenseTotal } from '../../components/helper/helper';
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
  const [stats, setStats] = useState({
    totalIncome: '$0',
    totalExpense: '$0',
    conversionRate: '0%'
  });

  // Update statistics when data changes
  useEffect(() => {
    if (isSuccess && data && data.length > 0) {
      // Use the helper functions to calculate totals
      const totalIncomeValue = getIncomeTotal(data);
      const totalExpenseValue = getExpenseTotal(data);
      
      // Calculate conversion rate (income to expense ratio)
      const conversionRateValue = totalExpenseValue > 0 
        ? ((totalIncomeValue / totalExpenseValue) * 100).toFixed(2) 
        : 0;

      setStats({
        totalIncome: `$${totalIncomeValue.toLocaleString()}`,
        totalExpense: `$${totalExpenseValue.toLocaleString()}`,
        conversionRate: `${conversionRateValue}%`
      });
    }
  }, [data, isSuccess]);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      {/* <Header title="Dashboard" /> */}
      
      <main className="w-full px-2 sm:px-4 lg:px-6 py-6 sm:py-10 lg:py-20">
        {/* STATS SECTION - Responsive at all breakpoints */}
        <motion.div
          className="w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5 mb-5 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-full">
            <StatCard name="Total Income" icon={FiZap} value={stats.totalIncome} color="#972C2CFF" />
          </div>
          <div className="w-full">
            <StatCard name="Total Expense" icon={FiUsers} value={stats.totalExpense} color="#000000" />
          </div>
          <div className="w-full sm:col-span-2 lg:col-span-1">
            <StatCard name="Income/Expense Ratio" icon={FiBarChart2} value={stats.conversionRate} color="#000000" />
          </div>
        </motion.div>

        {/* SALES CHART SECTION - Responsive at all breakpoints */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Sales Overview Box */}
          <motion.div
            className="bg-white border border-black rounded-xl shadow-lg p-4 sm:p-5 lg:p-6 w-full h-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="text-base sm:text-lg font-medium mb-3 sm:mb-4 text-black">Sales Overview</h2>

            <div className="h-60 sm:h-72 lg:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#000000" 
                    tick={{ fontSize: 12 }}
                    tickMargin={8}
                  />
                  <YAxis 
                    stroke="#000000" 
                    tick={{ fontSize: 12 }}
                    tickMargin={8}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(31, 41, 55, 0.8)",
                      borderColor: "#4B5563",
                    }}
                    itemStyle={{ color: "#000000" }}
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
            className="bg-white border border-black rounded-xl shadow-lg p-4 sm:p-5 lg:p-6 w-full h-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2 className="text-base sm:text-lg font-medium mb-3 sm:mb-4 text-black">Category Distribution</h2>
            <div className="h-60 sm:h-72 lg:h-80 flex items-center justify-center">
              <p className="text-black">Category data visualization will appear here</p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 