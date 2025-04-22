import React, { useState, useEffect } from "react";
// import { TrashIcon, EditIcon } from '@heroicons/react/outline';
import Fin_sidebar from "../../components/sidebar/fin_sidebar";

function Payment() {
  // Example data for payment history (you can replace this with real data)
  const paymentHistory = [
    {
      orderId: "12345",
      name: "John Doe",
      bank: "Bank A",
      accountNumber: "123-456-7890",
    },
    {
      orderId: "12346",
      name: "Jane Smith",
      bank: "Bank B",
      accountNumber: "098-765-4321",
    },
    {
      orderId: "12347",
      name: "Sam Green",
      bank: "Bank C",
      accountNumber: "111-222-3333",
    },
  ];

  // Action handler for buttons
  const handleActionClick = (orderId: string) => {
    alert(`Action clicked for Order ID: ${orderId}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - with full height */}
      <div className="h-screen sticky top-0">
        <Fin_sidebar />
      </div>
      
      <div className="flex-1 flex flex-col">
        {/* Header Section */}
        <div className="bg-white shadow-md py-6 mb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-green-900">Payment Management</h1>
            <p className="text-green-600 mt-1">Manage Payment records</p>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      
          {/* Additional History Table */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gradient-to-r from-green-600 to-green-500">
                    <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">Bank</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">Account Number</th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-white uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paymentHistory.map((item) => (
                    <tr key={item.orderId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.orderId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.bank}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.accountNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm flex justify-center space-x-2">
                        <button
                          className="p-1.5 bg-red-50 rounded-full text-red-600 hover:bg-red-100 transition-colors"
                          onClick={() => handleActionClick(item.orderId)}
                          title="Delete"
                        >
                          {/* <TrashIcon className="h-5 w-5" /> */}
                        </button>
                        
                        <button
                          className="p-1.5 bg-blue-50 rounded-full text-blue-600 hover:bg-blue-100 transition-colors"
                          onClick={() => handleActionClick(item.orderId)}
                          title="Edit"
                        >
                          {/* <EditIcon className="h-5 w-5" /> */}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default Payment;
