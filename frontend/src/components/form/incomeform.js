import React from 'react';
import { useForm } from 'react-hook-form';
import { default as api } from '../../store/apiSLice';
import { DollarSign, Calendar, Briefcase, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function IncomeForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  
  // For now, use the regular transaction endpoint
  const [addTransaction] = api.useAddTransactionMutation();

  // Get today's date in YYYY-MM-DD format for validation
  const today = new Date().toISOString().split('T')[0];

  const onSubmit = async (data) => {
    try {
      if (!data) return;
      
      // Always set the type to "Investment" (compatible with your backend)
      const incomeTransaction = {
        ...data,
        type: "Investment" // Using a valid type from your current backend
      };
      
      console.log("Submitting income transaction:", incomeTransaction);
      
      // Add the transaction using existing endpoint
      const result = await addTransaction(incomeTransaction).unwrap();
      console.log("Transaction result:", result);
      
      reset(); // Reset form fields after successful submission
      
      // Show success notification
      const notification = document.getElementById('success-notification');
      if (notification) {
        notification.classList.remove('hidden');
        setTimeout(() => {
          notification.classList.add('hidden');
        }, 3000);
      }
    } catch (error) {
      console.error("Failed to add income transaction.", error);
      
      // Show error notification
      const notification = document.getElementById('error-notification');
      if (notification) {
        notification.classList.remove('hidden');
        setTimeout(() => {
          notification.classList.add('hidden');
        }, 3000);
      }
    }
  };

  return (
    <div className="w-full">
      {/* Success notification */}
      <div id="success-notification" className="hidden">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-900/70 border border-green-700 rounded-lg p-3 mb-4 flex items-center"
        >
          <div className="bg-green-500/20 p-1 rounded-full mr-2">
            <div className="bg-green-500 rounded-full p-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <p className="text-green-200 text-sm">Income added successfully!</p>
        </motion.div>
      </div>
      
      {/* Error notification */}
      <div id="error-notification" className="hidden">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-900/70 border border-red-700 rounded-lg p-3 mb-4 flex items-center"
        >
          <div className="bg-red-500/20 p-1 rounded-full mr-2">
            <AlertCircle className="h-4 w-4 text-red-400" />
          </div>
          <p className="text-red-200 text-sm">Failed to add income. Please check all fields.</p>
        </motion.div>
      </div>

      <form
        id="incomeForm"
        onSubmit={handleSubmit(onSubmit)}
        className="w-full space-y-5"
      >
        {/* Income Source */}
        <div className="relative">
          <label className="text-gray-400 text-sm font-medium block mb-2">Income Source</label>
          <div className="relative">
            <div className="absolute left-3 top-3 text-gray-400">
              <Briefcase className="h-5 w-5" />
            </div>
            <input
              type="text"
              {...register('name', { required: 'Income source is required' })}
              placeholder=" Income Details"
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all outline-none"
            />
          </div>
          {errors.name && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm mt-1 flex items-center"
            >
              <AlertCircle className="h-3 w-3 mr-1" />
              {errors.name.message}
            </motion.p>
          )}
        </div>

        {/* Amount Input */}
        <div className="relative">
          <label className="text-gray-400 text-sm font-medium block mb-2">Amount</label>
          <div className="relative">
            <div className="absolute left-3 top-3 text-gray-400">
              <DollarSign className="h-5 w-5" />
            </div>
            <input
              type="number"
              {...register('amount', {
                required: 'Amount is required',
                min: { value: 1, message: 'Amount must be at least 1' },
                max: { value: 20000, message: 'Amount cannot exceed 20,000' },
              })}
              placeholder="Enter amount"
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all outline-none"
            />
          </div>
          {errors.amount && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm mt-1 flex items-center"
            >
              <AlertCircle className="h-3 w-3 mr-1" />
              {errors.amount.message}
            </motion.p>
          )}
        </div>

        {/* Date Input */}
        <div className="relative">
          <label className="text-gray-400 text-sm font-medium block mb-2">Receipt Date</label>
          <div className="relative">
            <div className="absolute left-3 top-3 text-gray-400">
              <Calendar className="h-5 w-5" />
            </div>
            <input
              type="date"
              {...register('date', {
                required: 'Date is required',
                validate: (value) => value <= today || 'Future dates are not allowed!',
              })}
              max={today}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl pl-11 pr-4 py-3 text-white focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all outline-none"
            />
          </div>
          {errors.date && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm mt-1 flex items-center"
            >
              <AlertCircle className="h-3 w-3 mr-1" />
              {errors.date.message}
            </motion.p>
          )}
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          className="w-full mt-6 relative overflow-hidden group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl"></div>
          <div className="absolute inset-0 w-3/4 h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl transition-all duration-300 ease-out group-hover:w-full"></div>
          <div className="relative px-6 py-3 font-medium text-white text-center shadow-xl">
            Add Income
          </div>
        </motion.button>
      </form>
    </div>
  );
}