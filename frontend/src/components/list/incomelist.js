import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { default as api } from '../../store/apiSLice';
import { useForm } from 'react-hook-form';
// Replace Heroicons import with boxicons that you're already using
import 'boxicons';

export default function IncomeList() {
  const { data, isFetching, isSuccess, isError } = api.useGetLabelsQuery();
  
  const [deleteTransaction] = api.useDeleteTransactionMutation();
  const [updateTransaction] = api.useUpdateTransactionMutation();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState(null);
  const [updatedName, setUpdatedName] = useState('');
  const [updatedAmount, setUpdatedAmount] = useState('');
  const [updatedDate, setUpdatedDate] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

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
    hidden: { opacity: 0, y: 10 },
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
    const incomeData = data.filter(item => item.type === 'Investment');
    
    if (incomeData.length === 0) {
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
          <p className="text-gray-400 mt-2 max-w-md mx-auto">Start tracking your income by adding your first transaction using the form above.</p>
        </motion.div>
      );
    } else {
      Incomes = (
        <motion.div
          variants={listVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {incomeData.map((v, i) => (
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
      {/* Header with filters and search (can be expanded later) */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="font-bold text-xl text-white mb-4 md:mb-0">Income History</h1>
        
        <div className="flex space-x-2">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search income..." 
              className="bg-black bg-opacity-30 border border-green-500/20 rounded-xl px-4 py-2 pl-10 text-sm outline-none text-white placeholder-gray-500 w-full md:w-auto"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <select className="bg-black bg-opacity-30 border border-green-500/20 rounded-xl px-4 py-2 text-sm outline-none text-white">
            <option value="">All Time</option>
            <option value="this-month">This Month</option>
            <option value="last-month">Last Month</option>
            <option value="this-year">This Year</option>
          </select>
        </div>
      </div>
      
      {/* Table header */}
      <div className="hidden md:grid md:grid-cols-12 text-sm text-gray-400 px-4 py-2 rounded-t-xl bg-black bg-opacity-30">
        <div className="col-span-1"></div>
        <div className="col-span-5">Description</div>
        <div className="col-span-3 text-right">Amount</div>
        <div className="col-span-3 text-right">Date</div>
      </div>
      
      {/* Income transactions */}
      <div className="space-y-3 mt-2">
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
              className="bg-gray-900 bg-opacity-95 backdrop-blur-lg p-8 rounded-2xl w-full max-w-lg mx-4 shadow-xl border border-green-500/20"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-2xl text-green-400">Update Income</h2>
                <button 
                  onClick={handleClosePopup}
                  className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  {/* <XIcon className="w-5 h-5 text-gray-400" /> */}
                </button>
              </div>
              
              <form onSubmit={handleSubmit(handleSubmitUpdate)} className="space-y-5">
                <div>
                  <label htmlFor="name" className="text-white font-medium block mb-2 flex items-center">
                    <box-icon name="edit" size="18px" color="#10b981" className="mr-2"></box-icon>
                    Description
                  </label>
                  <input
                    type="text"
                    id="name"
                    defaultValue={updatedName}
                    {...register('name', { required: "Description is required" })}
                    className="bg-black bg-opacity-40 border-2 border-green-500/30 focus:border-green-500/60 rounded-xl px-4 py-3 w-full text-white focus:outline-none transition-colors"
                  />
                  {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label htmlFor="amount" className="text-white font-medium block mb-2 flex items-center">
                    <box-icon name="dollar" size="18px" color="#10b981" className="mr-2"></box-icon>
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
                    className="bg-black bg-opacity-40 border-2 border-green-500/30 focus:border-green-500/60 rounded-xl px-4 py-3 w-full text-white focus:outline-none transition-colors"
                  />
                  {errors.amount && <p className="text-red-400 text-sm mt-1">{errors.amount.message}</p>}
                </div>

                <div>
                  <label htmlFor="date" className="text-white font-medium block mb-2 flex items-center">
                    <box-icon name="calendar" size="18px" color="#10b981" className="mr-2"></box-icon>
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
                    className="bg-black bg-opacity-40 border-2 border-green-500/30 focus:border-green-500/60 rounded-xl px-4 py-3 w-full text-white focus:outline-none transition-colors"
                  />
                  {errors.date && <p className="text-red-400 text-sm mt-1">{errors.date.message}</p>}
                </div>

                <div className="flex justify-end mt-8 space-x-3">
                  <motion.button
                    type="button"
                    onClick={handleClosePopup}
                    className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl flex items-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <box-icon name="x" size="18px" color="currentColor"></box-icon>
                    <span className="ml-1">Cancel</span>
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-xl flex items-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <box-icon name="check" size="18px" color="currentColor"></box-icon>
                    <span className="ml-1">Update</span>
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
      className="grid grid-cols-12 items-center py-4 px-4 rounded-xl bg-black bg-opacity-30 backdrop-filter backdrop-blur-sm hover:bg-opacity-40 transition-all duration-200 border-l-4 border-green-500"
      style={{ boxShadow: "0 4px 12px rgba(16, 185, 129, 0.1)" }}
    >
      {/* Actions */}
      <div className="col-span-12 md:col-span-1 flex md:justify-center space-x-2 mb-2 md:mb-0">
        <motion.button 
          className="p-2 rounded-lg bg-red-500 bg-opacity-20 hover:bg-opacity-30 transition-colors" 
          onClick={handler}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <box-icon name="trash" size="18px" data-id={income._id ?? ''} color="#f87171"></box-icon>
        </motion.button>
        <motion.button 
          className="p-2 rounded-lg bg-blue-500 bg-opacity-20 hover:bg-opacity-30 transition-colors" 
          onClick={onUpdate}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <box-icon name="edit" size="18px" data-id={income._id ?? ''} color="#60a5fa"></box-icon>
        </motion.button>
      </div>
      
      {/* Description */}
      <div className="col-span-12 md:col-span-5 truncate font-medium text-white mb-1 md:mb-0">
        {income.name ?? "Unnamed"}
      </div>
      
      {/* Amount */}
      <div className="col-span-6 md:col-span-3 text-right md:text-right text-green-400 font-bold">
        ${parseFloat(income.amount).toFixed(2)}
      </div>
      
      {/* Date */}
      <div className="col-span-6 md:col-span-3 text-right text-gray-300 flex items-center justify-end">
        <box-icon name="time" size="18px" color="#d1d5db" className="mr-1 opacity-70"></box-icon>
        {formatDate(income.date)}
      </div>
    </motion.div>
  );
}