import React from 'react';
import { useForm } from 'react-hook-form';
import { default as api } from '../../store/apiSLice';


export default function ExpenseForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [addTransaction] = api.useAddTransactionMutation();

  // Get today's date in YYYY-MM-DD format for validation
  const today = new Date().toISOString().split('T')[0];

  const onSubmit = async (data) => {
    try {
      if (!data) return;
      // Add the transaction and handle API response
      await addTransaction(data).unwrap();
      reset(); // Reset form fields after successful submission
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
      <label className="text-white font-medium">Transaction Name</label>
      <div className="flex items-center border-b-2 border-white">
        <input
          type="text"
          {...register('name', { required: 'Transaction name is required' })}
          placeholder="Salary, House Rent, SIP"
          className="w-full bg-transparent outline-none text-white placeholder-gray-400 px-2 py-1 sm:py-2"
        />
      </div>
      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
    </div>

    {/* Transaction Type Select */}
    <div className="mb-4">
      <label className="text-white font-medium">Transaction Type</label>
      <div className="border-b-2 border-white">
        <select
          className="bg-opacity-50 bg-gray-800 rounded-lg py-2 w-full focus:ring-2 focus:ring-blue-500"
          {...register('type', { required: 'Transaction type is required' })}
        >
          <option value="" className="text-white">Select Type</option>
          <option value="Investment" className="text-white">Investment</option>
          <option value="Expense" className="text-white">Expense</option>
          <option value="Savings" className="text-white">Savings</option>
        </select>
      </div>
      {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
    </div>

    {/* Amount Input */}
    <div className="mb-4">
      <label className="text-white font-medium">Amount</label>
      <div className="flex items-center border-b-2 border-white">
        <input
          type="number"
          {...register('amount', {
            required: 'Amount is required',
            min: { value: 1, message: 'Amount must be at least 1' },
            max: { value: 20000, message: 'Amount cannot exceed 20,000' },
          })}
          placeholder="Enter amount"
          className="w-full bg-transparent outline-none text-white placeholder-gray-400 px-2 py-1 sm:py-2"
        />
      </div>
      {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
    </div>

    {/* Date Input */}
    <div className="mb-4">
      <label className="text-white font-medium">Transaction Date</label>
      <div className="border-b-2 border-white">
        <input
          type="date"
          {...register('date', {
            required: 'Date is required',
            validate: (value) => value <= today || 'Future dates are not allowed!',
          })}
          max={today}
          className="w-full bg-transparent outline-none text-white px-2 py-1 sm:py-2"
        />
      </div>
      {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
    </div>

    {/* Submit Button */}
    <button
      type="submit"
      className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-3 sm:py-4 rounded-full transition mt-4 sm:text-lg"
      >
       Make Transaction
    </button>

  </form>
</div>

  );
}
