import React, { useState } from 'react';
import 'boxicons';
import { default as api } from '../../store/apiSLice';
import { useForm } from 'react-hook-form';

export default function IncomeList() {
  // For now, use the regular labels endpoint
  // Once backend is ready, switch to: const { data, isFetching, isSuccess, isError } = api.useGetIncomeLabelsQuery();
  const { data, isFetching, isSuccess, isError } = api.useGetLabelsQuery();
  
  const [deleteTransaction] = api.useDeleteTransactionMutation();
  const [updateTransaction] = api.useUpdateTransactionMutation();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState(null);
  const [updatedName, setUpdatedName] = useState('');
  const [updatedAmount, setUpdatedAmount] = useState('');
  const [updatedDate, setUpdatedDate] = useState('');
  const { register, handleSubmit, reset } = useForm();

  // Get today's date in YYYY-MM-DD format for validation
  const today = new Date().toISOString().split('T')[0];

  let Incomes;

  const handlerClick = (e) => {
    if (!e.target.dataset.id) return;
    deleteTransaction({ _id: e.target.dataset.id }).unwrap();
  };

  const handleUpdateClick = (e) => {
    if (!e.target.dataset.id) return;
    const incomeId = e.target.dataset.id;
    const income = data.find((item) => item._id === incomeId);

    if (income) {
      setSelectedIncome(income);
      setUpdatedName(income.name);
      setUpdatedAmount(income.amount);
      setUpdatedDate(income.date); // Load existing date
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

  if (isFetching) {
    Incomes = <div>Fetching...</div>;
  } else if (isSuccess) {
    // Filter for transactions that relate to income - since we're using Investment as a placeholder
    // Modify this when you have proper Income type
    const incomeData = data.filter(item => item.type === 'Investment');
    
    if (incomeData.length === 0) {
      Incomes = <div className="text-center text-gray-400 py-4">No income transactions found</div>;
    } else {
      Incomes = incomeData.map((v, i) => (
        <Transaction key={i} income={v} handler={handlerClick} onUpdate={handleUpdateClick}></Transaction>
      ));
    }
  } else if (isError) {
    Incomes = <div>Error loading income data</div>;
  }

  return (
    <div className="flex flex-col py-6 w-full gap-3">
      <h1 className="font-bold pb-4 text-xl">Income History</h1>
      
      {/* Income transactions list with better layout */}
      <div className="w-full overflow-x-auto">
        <div className="mb-2 grid grid-cols-5 text-sm text-gray-400 px-2">
          <div className="col-span-1">Actions</div>
          <div className="col-span-2">Description</div>
          <div className="col-span-1 text-right">Amount</div>
          <div className="col-span-1 text-right">Date</div>
        </div>
        
        <div className="space-y-2">
          {Incomes}
        </div>
      </div>

      {showPopup && selectedIncome && (
        <div className="popup-overlay fixed inset-0 bg-gray-800 bg-opacity-90 flex justify-center items-center z-50">
          <div className="popup-container bg-gray-900 bg-opacity-95 backdrop-blur-lg p-6 rounded-2xl w-full max-w-lg mx-4 shadow-xl border border-gray-700">
            <h2 className="font-bold text-xl mb-6 text-white">Update Income</h2>
            <form onSubmit={handleSubmit(handleSubmitUpdate)}>
              <div className="mb-5">
                <label htmlFor="name" className="text-white font-medium block mb-2">Description</label>
                <input
                  type="text"
                  id="name"
                  defaultValue={updatedName}
                  {...register('name', { required: "Description is required" })}
                  className="bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg p-3 w-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-5">
                <label htmlFor="amount" className="text-white font-medium block mb-2">Amount</label>
                <input
                  type="number"
                  id="amount"
                  defaultValue={updatedAmount}
                  {...register('amount', { 
                    required: "Amount is required",
                    min: { value: 1, message: "Amount must be at least 1" },
                    max: { value: 20000, message: "Amount cannot exceed 20,000" }
                  })}
                  className="bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg p-3 w-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="20000"
                />
              </div>

              <div className="mb-5">
                <label htmlFor="date" className="text-white font-medium block mb-2">Transaction Date</label>
                <input 
                  type="date"
                  id="date"
                  defaultValue={updatedDate}
                  {...register('date', {
                    required: "Date is required",
                    validate: (value) =>
                      value <= today || 'Future dates are not allowed!',
                  })}
                  max={today} // Restrict future dates
                  className="bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg p-3 w-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={handleClosePopup}
                  className="mr-4 bg-gray-700 hover:bg-gray-600 text-white px-5 py-2 rounded-lg transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-500 text-white px-5 py-2 rounded-lg transition duration-200"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Transaction({ income, handler, onUpdate }) {
  if (!income) return null;
  return (
    <div
      className="grid grid-cols-5 items-center py-3 px-2 rounded-lg text-white bg-gray-800 bg-opacity-30 hover:bg-opacity-40 transition duration-200"
      style={{ borderLeft: `4px solid ${income.color ?? "#16a34a"}` }}
    >
      <div className="col-span-1 flex space-x-2">
        <button 
          className="p-1 rounded hover:bg-gray-700 transition-colors" 
          onClick={handler}
        >
          <box-icon name="trash" size="18px" data-id={income._id ?? ''} color="#f87171"></box-icon>
        </button>
        <button 
          className="p-1 rounded hover:bg-gray-700 transition-colors" 
          onClick={onUpdate}
        >
          <box-icon name="edit" size="18px" data-id={income._id ?? ''} color="#60a5fa"></box-icon>
        </button>
      </div>
      <div className="col-span-2 truncate">{income.name ?? "Unnamed"}</div>
      <div className="col-span-1 text-right text-green-400">${parseFloat(income.amount).toFixed(2)}</div>
      <div className="col-span-1 text-right text-sm text-gray-300">{income.date ?? "No Date"}</div>
    </div>
  );
}