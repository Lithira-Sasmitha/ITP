import React from 'react';
import { useForm } from 'react-hook-form';
import { default as api } from '../../store/apiSLice';

export default function IncomeForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  
  // For now, use the regular transaction endpoint
  // Once backend is ready, switch to: const [addIncomeTransaction] = api.useAddIncomeTransactionMutation();
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
      alert("Income added successfully!");
    } catch (error) {
      console.error("Failed to add income transaction.", error);
      alert("Failed to add income. Make sure all fields are valid.");
    }
  };

  return (
    <div className="form max-w-sm mx-auto w-full px-4 sm:px-6">
      <form
        id="incomeForm"
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-md mx-auto w-full"
      >
        {/* Income Source */}
        <div className="mb-4">
          <label className="text-white font-medium">Income Source</label>
          <div className="flex items-center border-b-2 border-green-500">
            <input
              type="text"
              {...register('name', { required: 'Income source is required' })}
              placeholder="Salary, Freelance, Investments"
              className="w-full bg-transparent outline-none text-white placeholder-gray-400 px-2 py-1 sm:py-2"
            />
          </div>
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        {/* Amount Input */}
        <div className="mb-4">
          <label className="text-white font-medium">Amount</label>
          <div className="flex items-center border-b-2 border-green-500">
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
          <label className="text-white font-medium">Receipt Date</label>
          <div className="border-b-2 border-green-500">
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
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 sm:py-4 rounded-full transition mt-4 sm:text-lg"
        >
          Add Income
        </button>
      </form>
    </div>
  );
}