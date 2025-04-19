import React, { useState, useEffect } from 'react';
import 'boxicons';
import { default as api } from '../../store/apiSLice';
import { useForm } from 'react-hook-form';
import { Search, Calendar, DollarSign, Tag, FileText, X } from 'lucide-react';

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
  
  // Search functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('all');
  const [filteredData, setFilteredData] = useState([]);

  // Get today's date in YYYY-MM-DD format for validation
  const today = new Date().toISOString().split('T')[0];

  // Filter data based on search term
  useEffect(() => {
    if (isSuccess && data) {
      if (searchTerm === '') {
        setFilteredData(data);
        return;
      }
      
      const lowercaseSearchTerm = searchTerm.toLowerCase();
      
      const filtered = data.filter((item) => {
        if (searchField === 'name') {
          return item.name?.toLowerCase().includes(lowercaseSearchTerm);
        } else if (searchField === 'type') {
          return item.type?.toLowerCase().includes(lowercaseSearchTerm);
        } else if (searchField === 'amount') {
          return String(item.amount).includes(searchTerm);
        } else if (searchField === 'date') {
          return item.date?.includes(searchTerm);
        } else {
          // Search in all fields
          return (
            item.name?.toLowerCase().includes(lowercaseSearchTerm) ||
            item.type?.toLowerCase().includes(lowercaseSearchTerm) ||
            String(item.amount).includes(searchTerm) ||
            item.date?.includes(searchTerm)
          );
        }
      });
      
      setFilteredData(filtered);
    }
  }, [searchTerm, searchField, data, isSuccess]);

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
      setUpdatedDate(category.date);
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

  const clearSearch = () => {
    setSearchTerm('');
  };

  // Get search field icon and color
  const getSearchFieldProperties = () => {
    switch(searchField) {
      case 'name':
        return { icon: <FileText size={16} />, color: 'from-purple-500 to-indigo-500', textColor: 'text-indigo-600' };
      case 'type':
        return { icon: <Tag size={16} />, color: 'from-blue-500 to-cyan-500', textColor: 'text-blue-600' };
      case 'amount':
        return { icon: <DollarSign size={16} />, color: 'from-green-500 to-emerald-500', textColor: 'text-green-600' };
      case 'date':
        return { icon: <Calendar size={16} />, color: 'from-amber-500 to-orange-500', textColor: 'text-amber-600' };
      default:
        return { icon: <Search size={16} />, color: 'from-gray-500 to-slate-500', textColor: 'text-gray-600' };
    }
  };

  const { icon, color, textColor } = getSearchFieldProperties();

  let Transactions;

  if (isFetching) {
    Transactions = <div>Fetching...</div>;
  } else if (isSuccess) {
    Transactions = filteredData.map((v, i) => (
      <Transaction key={i} category={v} handler={handlerClick} onUpdate={handleUpdateClick}></Transaction>
    ));
  } else if (isError) {
    Transactions = <div>Error</div>;
  }
  

  return (
    <div className="flex flex-col py-6 w-full gap-3">
      <div className="flex flex-col sm:flex-row justify-between items-center pb-4 gap-3">
        
        {/* Creative Search bar */}
        <div className="relative w-full sm:w-auto min-w-[280px]">
          <div className={`flex items-center rounded-full shadow-md overflow-hidden bg-white bg-opacity-90 backdrop-blur-sm border-2 ${searchTerm ? 'border-' + color.split('-')[1] + '-400' : 'border-transparent'}`}>
            {/* Search Type Buttons */}
            <div className="flex bg-gray-100 rounded-l-full h-full">
              <button
                onClick={() => setSearchField('all')}
                className={`px-2 py-1.5 rounded-l-full transition ${searchField === 'all' ? 'bg-gradient-to-r from-gray-500 to-slate-500 text-white' : 'hover:bg-gray-200'}`}
                title="Search all fields"
              >
                <Search size={16} />
              </button>
              <button
                onClick={() => setSearchField('name')}
                className={`px-2 py-1.5 transition ${searchField === 'name' ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white' : 'hover:bg-gray-200'}`}
                title="Search by transaction name"
              >
                <FileText size={16} />
              </button>
              <button
                onClick={() => setSearchField('type')}
                className={`px-2 py-1.5 transition ${searchField === 'type' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' : 'hover:bg-gray-200'}`}
                title="Search by transaction type"
              >
                <Tag size={16} />
              </button>
              <button
                onClick={() => setSearchField('amount')}
                className={`px-2 py-1.5 transition ${searchField === 'amount' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' : 'hover:bg-gray-200'}`}
                title="Search by amount"
              >
                <DollarSign size={16} />
              </button>
              <button
                onClick={() => setSearchField('date')}
                className={`px-2 py-1.5 transition ${searchField === 'date' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' : 'hover:bg-gray-200'}`}
                title="Search by date"
              >
                <Calendar size={16} />
              </button>
            </div>
            
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="flex items-center pl-3">
                <span className={`mr-2 ${textColor}`}>{icon}</span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={`Search${searchField !== 'all' ? ' by ' + searchField : ''}...`}
                  className="w-full bg-transparent outline-none text-black py-2 pr-8"
                />
              </div>
              {searchTerm && (
                <button 
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
          
          {/* Search label */}
          {searchTerm && (
            <div className={`absolute -bottom-5 right-0 text-xs ${textColor} font-medium`}>
              Found {filteredData.length} matching transaction{filteredData.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Transaction list */}
      <div className=''>
      <div className="transaction-list space-y-2">
        {/* Table Header */}
        <div className="flex flex-col gap-2">
      {/* Header */}
      <div className="flex ml-36 w-[800px] items-center py-3 px-4 bg-gray-100 font-semibold text-gray-700 rounded-lg">
        <div className="flex items-center gap-3 flex-grow">
          <span>Name</span>
        </div>
        
        <div className="flex items-center">
          <span className="px-3">Type</span>
          <span className="px-3">Date</span>
          <span className="px-3">Amount</span>
          <div className="ml-2 w-16 text-center">Actions</div>
        </div>
      </div>
      </div>
      <div className="transaction-list space-y-2">
        {filteredData.length === 0 && searchTerm ? (
          <div className="text-center py-3 text-gray-500">No matching transactions found</div>
        ) : (
          Transactions
        )}
      </div>
      </div>
      {showPopup && selectedCategory && (
        <div className="popup-overlay fixed inset-0 bg-gray-800 bg-opacity-80 flex justify-center items-center z-50">
          <div className="popup-container bg-white bg-opacity-65 backdrop-blur-lg p-5 rounded-2xl w-full max-w-md">
            <h2 className="font-bold text-black text-xl mb-4">Update Transaction</h2>
            <form onSubmit={handleSubmit(handleSubmitUpdate)}>
              <div className="mb-4">
                <label htmlFor="name" className="text-black font-medium block mb-1">Transaction Name</label>
                <div className="border-b-2 border-black">
                  <input
                    type="text"
                    id="name"
                    defaultValue={updatedName}
                    {...register('name')}
                    className="bg-transparent outline-none text-black placeholder-gray-400 px-2 py-1 w-full"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="type" className="text-black font-medium block mb-1">Transaction Type</label>
                <select
                  id="type"
                  defaultValue={updatedType}
                  {...register('type')}
                  className="bg-white bg-opacity-80 border-b-2 border-black outline-none py-2 px-2 w-full"
                >
                  <option value="Investment">Investment</option>
                  <option value="Saving">Saving</option>
                  <option value="Expense">Expense</option>
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="amount" className="text-black font-medium block mb-1">Amount</label>
                <div className="border-b-2 border-black">
                  <input
                    type="number"
                    id="amount"
                    defaultValue={updatedAmount}
                    {...register('amount')}
                    className="bg-transparent outline-none text-black placeholder-gray-400 px-2 py-1 w-full"
                    min="0"
                    max="20000"
                    onChange={(e) => setUpdatedAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="date" className="text-black font-medium block mb-1">Transaction Date</label>
                <div className="border-b-2 border-black">
                  <input
                    type="date"
                    id="date"
                    defaultValue={updatedDate}
                    {...register('date', {
                      validate: (value) =>
                        value <= today || 'Future dates are not allowed!',
                    })}
                    max={today}
                    className="bg-transparent outline-none text-black placeholder-gray-400 px-2 py-1 w-full"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={handleClosePopup}
                  className="mr-3 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-colors"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}

function Transaction({ category, handler, onUpdate }) {
  if (!category) return null;
  return (
    <div
      className="item flex ml-36  w-[800px] items-center py-3 px-4 rounded-lg text-black bg-green-200  bg-opacity-70 backdrop-blur-sm shadow-lg hover:bg-opacity-80 transition-all"
      style={{ borderRight: `8px solid ${category.color ?? "#e5e5e5"}` }}
    >
      <div className="flex items-center gap-3 flex-grow">
        <span className="font-medium">{category.name ?? "Unnamed"}</span>
      </div>
      
      <div className="flex items-center">
        <span className="px-3 text-gray-600">{category.type ?? "Unnamed"}</span>
        <span className="px-3">{category.date ?? "No Date"}</span>
        <span className={`px-3 font-semibold ${category.type === 'Expense' ? 'text-red-600' : 'text-green-600'}`}>
          ${parseFloat(category.amount).toFixed(2)}
        </span>
        
        <div className="flex ml-2">
          <button 
            className="p-1 hover:bg-gray-200 rounded-full transition-colors" 
            onClick={onUpdate}
            title="Edit transaction"
          >
            <box-icon name="edit" size="18px" data-id={category._id ?? ''} color={category.color ?? "#555"}></box-icon>
          </button>
          <button
            className="p-1 hover:bg-gray-200 rounded-full transition-colors" 
            onClick={handler}
            title="Delete transaction"
          >
            <box-icon name="trash" size="18px" data-id={category._id ?? ''} color="#ff5555"></box-icon>
          </button>
        </div>
      </div>
    </div>
  );
}