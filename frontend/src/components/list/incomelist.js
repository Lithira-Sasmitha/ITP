import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { default as api } from '../../store/apiSLice';
import { useForm } from 'react-hook-form';
import { Calendar, Trash2, Edit2, Search, DollarSign, X, Check, Clock } from 'lucide-react';
import 'boxicons';

export default function IncomeList() {
  const { data, isFetching, isSuccess, isError } = api.useGetIncomeLabelsQuery();
  
  const [deleteTransaction] = api.useDeleteIncomeTransactionMutation();
  const [updateTransaction] = api.useUpdateIncomeTransactionMutation();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState(null);
  const [updatedName, setUpdatedName] = useState('');
  const [updatedAmount, setUpdatedAmount] = useState('');
  const [updatedDate, setUpdatedDate] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Get today's date in YYYY-MM-DD format for validation
  const today = new Date().toISOString().split('T')[0];

  let Incomes;

  // Animation variants
  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const handlerClick = (e) => {
    if (!e.target.dataset.id) return;
    
    // Show confirmation modal
    const isConfirmed = window.confirm("Are you sure you want to delete this income entry?");
    if (isConfirmed) {
      deleteTransaction({ _id: e.target.dataset.id }).unwrap();
    }
  };

  const handleUpdateClick = (e) => {
    if (!e.target.dataset.id) return;
    const incomeId = e.target.dataset.id;
    const income = data.find((item) => item._id === incomeId);

    if (income) {
      setSelectedIncome(income);
      setUpdatedName(income.name);
      setUpdatedAmount(income.amount);
      setUpdatedDate(income.date); 
      setShowPopup(true);
      // Prevent body scrolling when popup is open
      document.body.style.overflow = 'hidden';
    }
  };

  const handleSubmitUpdate = (formData) => {
    const updatedData = {
      _id: selectedIncome._id,
      name: formData.name || updatedName,
      type: selectedIncome.type, // Keep original type
      amount: formData.amount || updatedAmount,
      date: formData.date || updatedDate,
    };

    updateTransaction(updatedData).unwrap();
    setShowPopup(false);
    reset();
    // Restore body scrolling
    document.body.style.overflow = 'auto';
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    reset();
    // Restore body scrolling
    document.body.style.overflow = 'auto';
  };

  // Format date in a more readable format
  const formatDate = (dateString) => {
    if (!dateString) return "No Date";
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };
  console.log(data, "income label");

  // Calculate total income
  const calculateTotal = (transactions) => {
    if (!transactions || transactions.length === 0) return 0;
    return transactions.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0).toFixed(2);
  };

  if (isFetching) {
    Incomes = (
      <div className="flex justify-center items-center py-20">
        <div className="loader flex flex-col items-center">
          <svg className="animate-spin h-10 w-10 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="mt-4 text-green-400">Loading your income data...</span>
        </div>
      </div>
    );
  } else if (isSuccess) {
    // Filter for transactions that relate to income - since we're using Investment as a placeholder
    const incomeData = data.filter(item => item.type === 'Income');
    
    // Apply search filter if there is a search query
    const filteredBySearch = searchQuery 
      ? incomeData.filter(item => 
          item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : incomeData;
    
    // Apply time period filter
    let filteredData = filteredBySearch;
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    if (filterPeriod === 'this-month') {
      filteredData = filteredBySearch.filter(item => {
        const date = new Date(item.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      });
    } else if (filterPeriod === 'last-month') {
      filteredData = filteredBySearch.filter(item => {
        const date = new Date(item.date);
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
      });
    } else if (filterPeriod === 'this-year') {
      filteredData = filteredBySearch.filter(item => {
        const date = new Date(item.date);
        return date.getFullYear() === currentYear;
      });
    }
    
    if (filteredData.length === 0) {
      Incomes = (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-10"
        >
          <div className="inline-block p-6 bg-black bg-opacity-30 rounded-full mb-4">
            <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-300">No income transactions found</h3>
          <p className="text-gray-400 mt-2 max-w-md mx-auto">
            {searchQuery || filterPeriod !== 'all' 
              ? "Try adjusting your filters to see more transactions." 
              : "Start tracking your income by adding your first transaction using the form above."}
          </p>
        </motion.div>
      );
    } else {
      Incomes = (
        <div>
          {/* Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 mb-6 shadow-xl"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-white text-lg font-medium opacity-90">Total Income</h3>
                <p className="text-white text-3xl font-bold mt-2">${calculateTotal(filteredData)}</p>
                <p className="text-white text-sm mt-1 opacity-80">
                  {filterPeriod === 'this-month' ? 'This month' : 
                   filterPeriod === 'last-month' ? 'Last month' : 
                   filterPeriod === 'this-year' ? 'This year' : 'All time'}
                </p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <DollarSign size={24} className="text-white" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white border-opacity-20">
              <div className="flex justify-between text-white">
                <span className="opacity-80">Transactions</span>
                <span className="font-medium">{filteredData.length}</span>
              </div>
            </div>
          </motion.div>
          
          {/* Transaction List */}
          <motion.div
            variants={listVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {filteredData.map((v, i) => (
              <Transaction 
                key={i} 
                income={v} 
                handler={handlerClick} 
                onUpdate={handleUpdateClick}
                formatDate={formatDate}
                variants={itemVariants}
              />
            ))}
          </motion.div>
        </div>
      );
    }
  } else if (isError) {
    Incomes = (
      <div className="text-center py-10">
        <div className="inline-block p-4 bg-red-500 bg-opacity-20 rounded-full mb-4">
          <svg className="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-red-400">Error loading income data</h3>
        <p className="text-gray-400 mt-2">Please try refreshing the page or contact support if the problem persists.</p>
      </div>
    );
  }

  return (
    <div className="py-4 w-full">
      {/* Header with filters and search */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Income Transactions</h1>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <input 
              type="text" 
              placeholder="Search income..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white bg-opacity-10 border border-green-500/20 rounded-full px-5 py-3 pl-12 text-sm outline-none text-gray-800 placeholder-gray-500 w-full transition-all focus:border-green-500/40 focus:ring-2 focus:ring-green-500/20"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <Search className="w-5 h-5 text-gray-500" />
            </div>
          </div>
          
          <select 
            className="bg-white bg-opacity-10 border border-green-500/20 rounded-full px-5 py-3 text-sm outline-none text-gray-800 transition-all focus:border-green-500/40 focus:ring-2 focus:ring-green-500/20"
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="this-month">This Month</option>
            <option value="last-month">Last Month</option>
            <option value="this-year">This Year</option>
          </select>
        </div>
      </div>
      
      {/* Income transactions */}
      <div>
        {Incomes}
      </div>

      {/* Update Popup */}
      <AnimatePresence>
        {showPopup && selectedIncome && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-2xl w-full max-w-lg mx-4 shadow-xl overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
                <div className="flex justify-between items-center">
                  <h2 className="font-bold text-2xl text-white">Update Income</h2>
                  <button 
                    onClick={handleClosePopup}
                    className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
              
              <form onSubmit={handleSubmit(handleSubmitUpdate)} className="p-6 space-y-5">
                <div>
                  <label htmlFor="name" className="text-gray-700 font-medium block mb-2 flex items-center">
                    <Edit2 size={16} className="mr-2 text-green-500" />
                    Description
                  </label>
                  <input
                    type="text"
                    id="name"
                    defaultValue={updatedName}
                    {...register('name', { required: "Description is required" })}
                    className="bg-gray-100 border border-gray-300 focus:border-green-500 rounded-lg px-4 py-3 w-full text-gray-800 focus:outline-none transition-colors focus:ring-2 focus:ring-green-500/20"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label htmlFor="amount" className="text-gray-700 font-medium block mb-2 flex items-center">
                    <DollarSign size={16} className="mr-2 text-green-500" />
                    Amount
                  </label>
                  <input
                    type="number"
                    id="amount"
                    defaultValue={updatedAmount}
                    {...register('amount', { 
                      required: "Amount is required",
                      min: { value: 1, message: "Amount must be at least 1" },
                      max: { value: 1000000, message: "Amount cannot exceed 1,000,000" }
                    })}
                    className="bg-gray-100 border border-gray-300 focus:border-green-500 rounded-lg px-4 py-3 w-full text-gray-800 focus:outline-none transition-colors focus:ring-2 focus:ring-green-500/20"
                  />
                  {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
                </div>

                <div>
                  <label htmlFor="date" className="text-gray-700 font-medium block mb-2 flex items-center">
                    <Calendar size={16} className="mr-2 text-green-500" />
                    Transaction Date
                  </label>
                  <input 
                    type="date"
                    id="date"
                    defaultValue={updatedDate}
                    {...register('date', {
                      required: "Date is required",
                      validate: (value) => value <= today || 'Future dates are not allowed!',
                    })}
                    max={today}
                    className="bg-gray-100 border border-gray-300 focus:border-green-500 rounded-lg px-4 py-3 w-full text-gray-800 focus:outline-none transition-colors focus:ring-2 focus:ring-green-500/20"
                  />
                  {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
                </div>

                <div className="flex justify-end mt-8 space-x-3">
                  <motion.button
                    type="button"
                    onClick={handleClosePopup}
                    className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg flex items-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <X size={18} className="mr-1" />
                    <span>Cancel</span>
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg flex items-center shadow-md"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Check size={18} className="mr-1" />
                    <span>Update</span>
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Transaction({ income, handler, onUpdate, formatDate, variants }) {
  if (!income) return null;
  
  // Generate a random seed for the animation delay to create a more natural staggered effect
  const randomDelay = Math.random() * 0.2;
  
  return (
    <motion.div
      variants={variants}
      transition={{ duration: 0.3, delay: randomDelay }}
      className="relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-4"
      whileHover={{ y: -2 }}
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
      
      <div className="grid grid-cols-12 items-center gap-4">
        {/* Description */}
        <div className="col-span-12 md:col-span-5">
          <h3 className="font-medium text-gray-800 truncate">{income.name ?? "Unnamed"}</h3>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <Clock size={14} className="mr-1" />
            {formatDate(income.date)}
          </div>
        </div>
        
        {/* Amount */}
        <div className="col-span-7 md:col-span-4">
          <div className="font-bold text-xl text-green-600">${parseFloat(income.amount).toFixed(2)}</div>
        </div>
        
        {/* Actions */}
        <div className="col-span-5 md:col-span-3 flex justify-end space-x-2">
          <motion.button 
            className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition-colors" 
            onClick={handler}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Trash2 size={16} data-id={income._id ?? ''} className="text-red-500" />
          </motion.button>
          <motion.button 
            className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors" 
            onClick={onUpdate}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Edit2 size={16} data-id={income._id ?? ''} className="text-blue-500" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}