import React, { useState } from 'react';
import 'boxicons';
import { default as api } from '../../store/apiSLice';
import { useForm } from 'react-hook-form';

export default function Expencelist() {
  const { data, isFetching, isSuccess, isError } = api.useGetLabelsQuery();
  const [deleteTransaction] = api.useDeleteTransactionMutation();
  const [updateTransaction] = api.useUpdateTransactionMutation();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatedName, setUpdatedName] = useState('');
  const [updatedType, setUpdatedType] = useState('');
  const [updatedAmount, setUpdatedAmount] = useState('');
  const [updatedDate, setUpdatedDate] = useState('');
  const { register, handleSubmit, reset } = useForm();

  // Get today's date in YYYY-MM-DD format for validation
  const today = new Date().toISOString().split('T')[0];

  let Transactions;

  const handlerClick = (e) => {
    if (!e.target.dataset.id) return;
    deleteTransaction({ _id: e.target.dataset.id }).unwrap();
  };

  const handleUpdateClick = (e) => {
    if (!e.target.dataset.id) return;
    const categoryId = e.target.dataset.id;
    const category = data.find((item) => item._id === categoryId);

    if (category) {
      setSelectedCategory(category);
      setUpdatedName(category.name);
      setUpdatedType(category.type);
      setUpdatedAmount(category.amount);
      setUpdatedDate(category.date); // Load existing date
      setShowPopup(true);
    }
  };

  const handleSubmitUpdate = (formData) => {
    const updatedData = {
      _id: selectedCategory._id,
      name: formData.name || updatedName,
      type: formData.type || updatedType,
      amount: formData.amount || updatedAmount,
      date: formData.date || updatedDate,
    };

    updateTransaction(updatedData).unwrap();
    setShowPopup(false);
    reset();
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    reset();
  };

  if (isFetching) {
    Transactions = <div>Fetching...</div>;
  } else if (isSuccess) {
    Transactions = data.map((v, i) => (
      <Transaction key={i} category={v} handler={handlerClick} onUpdate={handleUpdateClick}></Transaction>
    ));
  } else if (isError) {
    Transactions = <div>Error</div>;
  }

  return (
    <div className="flex flex-col py-6 gap-3">
      <h1 className="font-bold pb-4 text-xl">History</h1>
      {Transactions}

      {showPopup && selectedCategory && (
        <div className="popup-overlay fixed inset-0 bg-gray-800 bg-opacity-80 flex justify-center items-center">
          <div className="popup-container bg-blue-900 bg-opacity-65 backdrop-blur-lg p-5 rounded-2xl">
            <h2 className="font-bold text-xl mb-4">Update Transaction</h2>
            <form onSubmit={handleSubmit(handleSubmitUpdate)}>
              <div className="mb-4">
              <label htmlFor="name" className="text-white font-medium">Category Name</label>
             
                <input
                  type="text"
                  id="name"
                  defaultValue={updatedName}
                  {...register('name')}
                  className="  bg-transparent outline-none text-white placeholder-gray-400 px-2 w-full"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="type" className="text-white font-medium">Category Type</label>
                <select
    id="type"
    defaultValue={updatedType}
    {...register('type')}
    className="bg-gray-800 bg-opacity-50  rounded-lg  py-2 w-full "
  >
                  <option value="Investment">Investment</option>
                  <option value="Saving">Saving</option>
                  <option value="Expense">Expense</option>
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="amount" className="text-white font-medium">Amount</label>
                <input
                  type="number"
                  id="amount"
                  defaultValue={updatedAmount}
                  {...register('amount')}
                  className="bg-transparent outline-none text-white placeholder-gray-400 px-2 w-full"
                  min="0"
                  max="20000"
                  onChange={(e) => setUpdatedAmount(e.target.value)}
                />
              </div>

              {/* Date Input with Validation */}
              <div className="mb-4 ">
                <label htmlFor="date" className="text-white font-medium">Transaction Date</label>
                <input 
                  type="date"
                  id="date"
                  defaultValue={updatedDate}
                  {...register('date', {
                    validate: (value) =>
                      value <= today || 'Future dates are not allowed!',
                  })}
                  max={today} // Restrict future dates
                  className="bg-transparent outline-none text-white placeholder-gray-400 px-2 w-full "
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleClosePopup}
                  className="mr-3 bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-700 text-white px-4 py-2 rounded"
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

function Transaction({ category, handler, onUpdate }) {
  if (!category) return null;
  return (
    <div
      className="item flex justify-center py-2 rounded-r text-white bg-transparent"
      style={{ borderRight: `8px solid ${category.color ?? "#e5e5e5"}` }}
    >
      <button className="px-3" onClick={handler}>
        <box-icon name="trash" size="15px" data-id={category._id ?? ''} color={category.color ?? "#e5e5e5"}></box-icon>
      </button>
      <button className="px-3" onClick={onUpdate}>
        <box-icon name="edit" size="15px" data-id={category._id ?? ''} color={category.color ?? "#e5e5e5"}></box-icon>
      </button>
      <span className="block w-full">{category.name ?? "Unnamed"}</span>
      <span className="block w-full">{category.type ?? "Unnamed"}</span>
      <span className="block w-full">{category.date ?? "No Date"}</span>
    </div>
  );
}
