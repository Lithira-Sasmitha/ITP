import React from 'react';
import { useForm } from 'react-hook-form';
import { default as api } from '../../store/apiSLice';
import { Calendar } from 'lucide-react';

export default function IncomeForm() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      name: '',
      amount: '',
      date: new Date().toISOString().split('T')[0]
    }
  });
  
  const [addTransaction] = api.useAddIncomeTransactionMutation();
  const today = new Date().toISOString().split('T')[0];

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
    <div className="w-full max-w-lg mx-auto p-4">
      {/* Success notification */}
      <div id="success-notification" className="hidden mb-4">
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 rounded">
          Transaction added successfully!
        </div>
      </div>
      
      {/* Error notification */}
      <div id="error-notification" className="hidden mb-4">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded">
          Failed to add transaction. Please check all fields.
        </div>
      </div>

      <div className="mb-6 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 mr-2">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
        <h2 className="text-xl font-medium text-gray-800">Add Transaction</h2>
      </div>

      <form
        id="transactionForm"
        onSubmit={handleSubmit(onSubmit)}
        className="w-full space-y-6"
      >
        {/* Transaction Name */}
        <div>
          <label className="block text-gray-700 mb-2">Transaction Name</label>
          <input
            type="text"
            {...register('name', { 
              required: 'Transaction name is required',
              minLength: { value: 3, message: 'Name must be at least 3 characters' }
            })}
            placeholder="Enter Your Transaction"
            className="w-full border-b border-gray-300 py-2 focus:border-green-500 focus:outline-none"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-gray-700 mb-2">Amount</label>
          <input
            type="number"
            step="0.01"
            {...register('amount', {
              required: 'Amount is required',
              min: { value: 1, message: 'Amount must be at least 1' }
            })}
            placeholder="Enter amount"
            className="w-full border-b border-gray-300 py-2 focus:border-green-500 focus:outline-none"
          />
          {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
        </div>

        {/* Date Input */}
        <div>
          <label className="block text-gray-700 mb-2">Transaction Date</label>
          <div className="relative">
            <input
              type="date"
              {...register('date', {
                required: 'Date is required'
              })}
              placeholder="mm/dd/yyyy"
              className="w-full border-b border-gray-300 py-2 focus:border-green-500 focus:outline-none pr-10"
              max={today}
            />
            
          </div>
          {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-8 bg-green-500 text-white py-3 px-6 rounded-full hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-70"
        >
          {isSubmitting ? 'Processing...' : 'Make Transaction'}
        </button>
      </form>
    </div>
  );
}