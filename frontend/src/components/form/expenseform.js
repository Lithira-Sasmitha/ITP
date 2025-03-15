import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Expencelist from '../list/expencelist'; 
import { default as api } from '../../store/apiSLice';

export default function Expenseform() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [addTransaction] = api.useAddTransactionMutation();

  // Get today's date in YYYY-MM-DD format for validation
  const today = new Date().toISOString().split('T')[0];

  const onSubmit = async (data) => {
    try {
      if (!data) return;
      await addTransaction(data).unwrap();
      reset(); // Reset all fields after submission
    } catch (error) {
      console.error("Failed to add transaction.", error);
    }
  };

  return (
    <div className="form max-w-sm mx-auto w-96">
      <h1 className="font-bold pb-4 text-xl">Transaction</h1>

      <form id="expencesform" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          {/* Name Input */}
          <div className="input-group bg-gray-200">
            <input
              type="text"
              {...register('name', { required: 'Transaction name is required' })}
              placeholder="Salary, House Rent, SIP"
              className="form-input"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          {/* Transaction Type Select */}
          <select className="form-input" {...register('type', { required: 'Transaction type is required' })}>
            <option value="">Select Type</option>
            <option value="Investment">Investment</option>
            <option value="Expense">Expense</option>
            <option value="Savings">Savings</option>
          </select>
          {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}

          {/* Amount Input */}
          <div className="input-group">
            <input
              type="number"
              {...register('amount', {
                required: 'Amount is required',
                min: { value: 1, message: 'Amount must be at least 1' },
                max: { value: 20000, message: 'Amount cannot exceed 20,000' },
              })}
              placeholder="Amount"
              className="form-input"
            />
            {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
          </div>

          {/* Date Input with Validation */}
          <div className="input-group">
            <input
              type="date"
              {...register('date', {
                required: 'Date is required',
                validate: (value) =>
                  value <= today || 'Future dates are not allowed!'
              })}
              max={today} // Restrict future dates
              className="form-input"
            />
            {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
          </div>

          {/* Submit Button */}
          <div className="submit-btn">
            <button type="submit" className="border py-2 text-white bg-indigo-500 w-full">
              Make Transaction
            </button>
          </div>
        </div>
      </form>

      {/* Render the correct component */}
      <Expencelist /> 
    </div>
  );
}
