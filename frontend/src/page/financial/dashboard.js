import { FaEnvelope } from "react-icons/fa";
import { FiZap, FiUsers, FiShoppingBag, FiBarChart2 } from "react-icons/fi";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import StatCard from "../../components/statCard/statCard"; 
import Header from "../../components/header/header";

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
	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Dashboard' />
      
			<main className='w-full px-4 lg:px-6 py-20'>
				{/* STATS SECTION */}
				<motion.div
	      className='w-full max-w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5 mb-8'
	      initial={{ opacity: 0, y: 20 }}
	      animate={{ opacity: 1, y: 0 }}
	      transition={{ duration: 1 }}
>
	      < StatCard name='Total Income' icon={FiZap} value='$12,345' color='#6366F1' />
	      <StatCard name='Expense' icon={FiUsers} value='1,234' color='#8B5CF6' />
	      <StatCard name='Conversion Rate' icon={FiBarChart2} value='12.5%' color='#10B981' />
      </motion.div>


				{/* SALES CHART SECTION */}
        <div className="grid grid-cols-2 gap-10">
  {/* Sales Overview Box */}
  <motion.div
    className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 w-full max-w-full"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
  >
    <h2 className="text-lg font-medium mb-4 text-gray-100">Sales Overview</h2>

    <div className="h-80">
      <ResponsiveContainer width={"100%"} height={"100%"}>
        <LineChart data={salesData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
          <XAxis dataKey={"name"} stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
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
            strokeWidth={3}
            dot={{ fill: "#6366F1", strokeWidth: 2, r: 6 }}
            activeDot={{ r: 8, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </motion.div>

  {/* Category Distribution Box */}
  <motion.div
    className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 w-full max-w-full"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
  >
    <h2 className="text-lg font-medium mb-4 text-gray-100">Category Distribution</h2>
    {/* You can add a chart or content here for Category Distribution */}
  </motion.div>
</div>

    
			</main>
		</div>
	);
};

export default Dashboard;
