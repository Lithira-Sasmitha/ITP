import React from 'react';
import { useForm } from 'react-hook-form';
import { default as api } from '../../store/apiSLice';
import { DollarSign, Calendar, Briefcase, AlertCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export default function IncomeForm() {
  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      name: '',
      amount: '',
      date: new Date().toISOString().split('T')[0]
    }
  });
  
  const [addTransaction] = api.useAddTransactionMutation();
  const today = new Date().toISOString().split('T')[0];
  const watchAmount = watch('amount');

  const onSubmit = async (data) => {
    try {
      if (!data) return;
      
      const incomeTransaction = {
        ...data,
        type: "Investment" 
      };
      
      console.log("Submitting income transaction:", incomeTransaction);
      
      const result = await addTransaction(incomeTransaction).unwrap();
      console.log("Transaction result:", result);
      
      reset(); 
      
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
              {...register('name', { 
                required: 'Income source is required',
                minLength: { value: 3, message: 'Income source must be at least 3 characters' },
                maxLength: { value: 50, message: 'Income source cannot exceed 50 characters' },
                pattern: {
                  value: /^[a-zA-Z0-9\s\-\_\&\.]+$/,
                  message: 'Only letters, numbers, spaces, and basic punctuation are allowed'
                }
              })}
              placeholder="Income Details"
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all outline-none"
            />
          </div>
          {errors.name ? (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm mt-1 flex items-center"
            >
              <AlertCircle className="h-3 w-3 mr-1" />
              {errors.name.message}
            </motion.p>
          ) : (
            <div className="text-gray-500 text-xs mt-1 flex items-start">
              <Info className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
              <span>Enter the source of your income (e.g., Salary, Dividend, Stock Sale)</span>
            </div>
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
              step="0.01"
              {...register('amount', {
                required: 'Amount is required',
                min: { value: 1, message: 'Amount must be at least 1' },
                max: { value: 20000, message: 'Amount cannot exceed 20,000' },
                validate: {
                  isNumber: value => !isNaN(parseFloat(value)) || 'Please enter a valid number',
                  hasTwoDecimalPlaces: value => {
                    const decimalPlaces = (value.toString().split('.')[1] || '').length;
                    return decimalPlaces <= 2 || 'Amount cannot have more than 2 decimal places';
                  }
                }
              })}
              placeholder="Enter amount"
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all outline-none"
            />
          </div>
          {errors.amount ? (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm mt-1 flex items-center"
            >
              <AlertCircle className="h-3 w-3 mr-1" />
              {errors.amount.message}
            </motion.p>
          ) : (
            <div className="flex justify-between mt-1">
              <div className="text-gray-500 text-xs flex items-start">
                <Info className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                <span>Enter amount between 1-20,000</span>
              </div>
              {watchAmount && !isNaN(parseFloat(watchAmount)) && (
                <div className="text-green-400 text-xs">
                  ${parseFloat(watchAmount).toFixed(2)}
                </div>
              )}
            </div>
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
                validate: {
                  notInFuture: value => value <= today || 'Future dates are not allowed',
                  notTooOld: value => {
                    const sixMonthsAgo = new Date();
                    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
                    const sixMonthsAgoStr = sixMonthsAgo.toISOString().split('T')[0];
                    return value >= sixMonthsAgoStr || 'Date cannot be older than 6 months';
                  }
                }
              })}
              max={today}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl pl-11 pr-4 py-3 text-white focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all outline-none"
            />
          </div>
          {errors.date ? (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-800 text-sm mt-1 flex items-center"
            >
              <AlertCircle className="h-3 w-3 mr-1" />
              {errors.date.message}
            </motion.p>
          ) : (
            <div className="text-gray-500 text-xs mt-1 flex items-start">
              <Info className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
              <span>Select date when income was received (within past 6 months)</span>
            </div>
          )}
        </div>

        
        {Object.keys(errors).length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-900/30 border border-red-700/50 rounded-lg p-3"
          >
            <h4 className="text-red-300 text-sm font-medium mb-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              Please fix the following issues:
            </h4>
            <ul className="text-red-200 text-xs list-disc pl-5 space-y-1">
              {errors.name && <li>{errors.name.message}</li>}
              {errors.amount && <li>{errors.amount.message}</li>}
              {errors.date && <li>{errors.date.message}</li>}
            </ul>
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-6 relative overflow-hidden group disabled:opacity-70"
          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl"></div>
          <div className="absolute inset-0 w-3/4 h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl transition-all duration-300 ease-out group-hover:w-full"></div>
          <div className="relative px-6 py-3 font-medium text-white text-center shadow-xl">
            {isSubmitting ? 'Processing...' : 'Add Income'}
          </div>
        </motion.button>
      </form>
    </div>
  );
}