import { FaEnvelope, FaCheck, FaTimes } from "react-icons/fa";
import { FiZap, FiUsers, FiBarChart2 } from "react-icons/fi";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { BarChart2, DollarSign, Menu, Settings, ShoppingBag, ShoppingCart, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

import { getTotal, getIncomeTotal, getExpenseTotal } from '../../components/helper/helper';
import StatCard from "../../components/statCard/statCard"; 

import { default as api } from '../../store/apiSLice';
import Fin_sidebar from "../../components/sidebar/fin_sidebar"; 

const Dashboard = () => {
  const { data, isFetching, isSuccess } = api.useGetLabelsQuery();
  const [stats, setStats] = useState({
    totalIncome: '$0',
    totalExpense: '$0',
    conversionRate: '0%'
  });
  
  const [chartData, setChartData] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(true);
  
  // Process transaction data for chart when data changes
  useEffect(() => {
    if (isSuccess && data && data.length > 0) {
      // Group transactions by month
      const groupedData = processTransactionsForChart(data);
      setChartData(groupedData);
      
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

  // Fetch pending payments
  useEffect(() => {
    const fetchPendingPayments = async () => {
      try {
        setLoadingPayments(true);
        const response = await axios.get("http://localhost:5000/api/payments/");
        // Filter to only include pending payments
        const pendingOnly = response.data.filter(payment => payment.paymentStatus === "Pending");
        setPendingPayments(pendingOnly);
        setLoadingPayments(false);
      } catch (error) {
        console.error("Error fetching payments:", error);
        setLoadingPayments(false);
      }
    };
    
    fetchPendingPayments();
  }, []);

  // Update payment status
  const updatePaymentStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/payments/${id}`, {
        paymentStatus: newStatus,
      });
      
      // Update the local state to remove the payment that was just updated
      setPendingPayments(pendingPayments.filter(payment => payment._id !== id));
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  const handleCorrectClick = (id) => {
    updatePaymentStatus(id, "Complete");
  };

  const handleIncorrectClick = (id) => {
    updatePaymentStatus(id, "Rejected");
  };

  // Function to safely get product type as string
  const getProductTypeDisplay = (productType) => {
    if (!productType) return "N/A";
    
    // If it's a string, return it directly
    if (typeof productType === 'string') return productType;
    
    // If it's an object with a title property, return the title
    if (typeof productType === 'object' && productType.title) return productType.title;
    
    // Otherwise, just return a placeholder
    return "Product";
  };

  // Function to process transactions for chart display
  const processTransactionsForChart = (transactions) => {
    // Get current year
    const currentYear = new Date().getFullYear();
    
    // Create a map to store monthly data
    const monthlyData = {};
    
    // Initialize months
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    // Initialize the monthly data structure with zeros
    months.forEach(month => {
      monthlyData[month] = { name: month, income: 0, expense: 0 };
    });
    
    // Process each transaction
    transactions.forEach(transaction => {
      if (!transaction.date) return;
      
      const date = new Date(transaction.date);
      const transactionMonth = months[date.getMonth()];
      const amount = parseFloat(transaction.amount) || 0;
      
      // Only process transactions from the current year
      if (date.getFullYear() === currentYear) {
        // Check transaction type and add to appropriate category
        if (transaction.type === 'Investment') {
          // Assuming 'Investment' is your income type
          monthlyData[transactionMonth].income += amount;
        } else {
          // All other types are considered expenses
          monthlyData[transactionMonth].expense += amount;
        }
      }
    });
    
    // Convert the map to an array and sort by month order
    const monthOrder = {};
    months.forEach((month, index) => {
      monthOrder[month] = index;
    });
    
    return Object.values(monthlyData).sort((a, b) => {
      return monthOrder[a.name] - monthOrder[b.name];
    });
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-green-50 to-green-100">
      
      { <Fin_sidebar />}
      
        
        
      {/* Main Content */}
      <div className={`flex-1 overflow-auto transition-all duration-300  'ml-0' : 'ml-0'}`}>
        {/* Toggle Button */}
        <div className="p-4 flex items-center">
          
          <h1 className="text-xl font-bold">Dashboard</h1>
        </div>
        
        <main className="w-full px-2 sm:px-4 lg:px-6 py-6 sm:py-10 lg:py-20">
          {/* STATS SECTION - Responsive at all breakpoints */}
          <motion.div
            className="w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5 mb-5 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-full">
              <StatCard name="Total Income" icon={FiZap} value={stats.totalIncome} color="#4ade80" />
            </div>
            <div className="w-full">
              <StatCard name="Total Expense" icon={FiUsers} value={stats.totalExpense} color="#f87171" />
            </div>
            <div className="w-full sm:col-span-2 lg:col-span-1">
              <StatCard name="Income/Expense Ratio" icon={FiBarChart2} value={stats.conversionRate} color="#000000" />
            </div>
          </motion.div>

          {/* SALES CHART SECTION - Responsive at all breakpoints */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Financial Overview Chart Box */}
            <motion.div
              className="bg-white border border-black rounded-xl shadow-lg p-4 sm:p-5 lg:p-6 w-full h-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h2 className="text-base sm:text-lg font-medium mb-3 sm:mb-4 text-black">Financial Overview</h2>

              {isFetching ? (
                <div className="h-60 sm:h-72 lg:h-80 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                </div>
              ) : (
                <div className="h-60 sm:h-72 lg:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis 
                        dataKey="name" 
                        stroke="#374151" 
                        tick={{ fontSize: 12 }}
                        tickMargin={8}
                      />
                      <YAxis 
                        stroke="#374151" 
                        tick={{ fontSize: 12 }}
                        tickMargin={8}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip
                        formatter={(value) => [`$${value.toFixed(2)}`, undefined]}
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          borderColor: "#E5E7EB",
                          borderRadius: "0.5rem",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                        }}
                        labelStyle={{ fontWeight: "bold", color: "#111827" }}
                      />
                      <Legend verticalAlign="top" height={36} />
                      <Line
                        type="monotone"
                        dataKey="income"
                        name="Income"
                        stroke="#4ade80"
                        strokeWidth={2}
                        dot={{ fill: "#4ade80", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, strokeWidth: 2 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="expense"
                        name="Expense"
                        stroke="#f87171"
                        strokeWidth={2}
                        dot={{ fill: "#f87171", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </motion.div>

            {/* Pending Payments Box */}
            <motion.div
              className="bg-white border border-black rounded-xl shadow-lg p-4 sm:p-5 lg:p-6 w-full h-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h2 className="text-base sm:text-lg font-medium text-black">Pending Payments</h2>
                <Link 
                  to="/payment" 
                  className="text-sm text-green-600 hover:text-green-800 hover:underline transition-colors"
                >
                  View All Payments
                </Link>
              </div>
              
              <div className="overflow-auto max-h-[60vh]">
                {loadingPayments ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                  </div>
                ) : pendingPayments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="bg-green-100 p-4 rounded-full mb-4">
                      <FaCheck className="text-green-600 text-2xl" />
                    </div>
                    <p className="text-gray-700 font-medium">All caught up!</p>
                    <p className="text-gray-500 text-sm mt-1">No pending payments at the moment.</p>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pendingPayments.slice(0, 5).map((payment) => (
                        <tr key={payment._id} className="hover:bg-gray-50">
                          <td className="px-3 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{payment.order_id}</div>
                            <div className="text-xs text-gray-500">{new Date(payment.createdAt).toLocaleDateString()}</div>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{payment.fullName}</div>
                            <div className="text-xs text-gray-500">{getProductTypeDisplay(payment.selectedproduct_type)}</div>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-green-600">${Number(payment.total).toLocaleString()}</div>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button 
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md transition-colors flex items-center"
                                onClick={() => handleCorrectClick(payment._id)}
                              >
                                <FaCheck className="mr-1" size={12} />
                              </button>
                              <button 
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition-colors flex items-center"
                                onClick={() => handleIncorrectClick(payment._id)}
                              >
                                <FaTimes className="mr-1" size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                
                {pendingPayments.length > 5 && (
                  <div className="mt-4 text-center">
                    <Link 
                      to="/payment" 
                      className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-sm font-medium"
                    >
                      View {pendingPayments.length - 5} more pending payments
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;