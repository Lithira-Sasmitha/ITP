import React from 'react';
import { useForm } from 'react-hook-form';
import { default as api } from '../../store/apiSLice';

export default function ExpenseForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [addTransaction] = api.useAddTransactionMutation();

  
  const today = new Date().toISOString().split('T')[0];

  const onSubmit = async (data) => {
    try {
      if (!data) return;
      // Add the transaction and handle API response
      await addTransaction(data).unwrap();
      reset(); 
    } catch (error) {
      console.error("Failed to add transaction.", error);
    }
  };

  return (
    <div className="form max-w-sm mx-auto w-full px-4 sm:px-6">
      <form
        id="expensesForm"
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-md mx-auto w-full"
      >
        {/* Transaction Name */}
        <div className="mb-4">
          <label className="text-black font-medium">Transaction Name</label>
          <div className="flex items-center border-b-2 border-black">
            <input
              type="text"
              {...register('name', { required: 'Transaction name is required' })}
              placeholder="Enter Your Transaction"
              className="w-full bg-transparent outline-none text-black placeholder-gray-700 px-2 py-1 sm:py-2"
            />
          </div>
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        {/* Transaction Type Select */}
        <div className="mb-4">
          <label className="text-black font-medium">Transaction Type</label>
          <div className="border-b-2 border-black">
            <select
              className="bg-opacity-50 bg-gray-200 rounded-lg py-2 w-full focus:ring-2 focus:ring-blue-500 text-black"
              {...register('type', { required: 'Transaction type is required' })}
            >
              <option value="" className="text-black">Select Type</option>
              <option value="Investment" className="text-black">Investment</option>
              <option value="Expense" className="text-black">Expense</option>
              <option value="Savings" className="text-black">Savings</option>
            </select>
          </div>
          {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
        </div>

        {/* Amount Input */}
        <div className="mb-4">
          <label className="text-black font-medium">Amount</label>
          <div className="flex items-center border-b-2 border-black">
            <input
              type="number"
              {...register('amount', {
                required: 'Amount is required',
                min: { value: 1, message: 'Amount must be at least 1' },
                max: { value: 20000, message: 'Amount cannot exceed 20,000' },
              })}
              placeholder="Enter amount"
              className="w-full bg-transparent outline-none text-black placeholder-gray-700 px-2 py-1 sm:py-2"
            />
          </div>
          {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
        </div>

        {/* Date Input */}
        <div className="mb-4">
          <label className="text-black font-medium">Transaction Date</label>
          <div className="border-b-2 border-black">
            <input
              type="date"
              {...register('date', {
                required: 'Date is required',
                validate: (value) => value <= today || 'Future dates are not allowed!',
              })}
              max={today}
              className="w-full bg-transparent outline-none text-black px-2 py-1 sm:py-2"
            />
          </div>
          {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-black font-medium py-3 sm:py-4 rounded-full transition mt-4 sm:text-lg"
        >
          Make Transaction
        </button>
      </form>
    </div>
  );
}