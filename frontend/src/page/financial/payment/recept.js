import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Receipt = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [receiptData, setReceiptData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // First try to get data from localStorage
    const fetchReceiptData = () => {
      try {
        setLoading(true);
        const storedData = localStorage.getItem("paymentData");
        
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          
          // Check if the stored data matches the requested order ID
          if (parsedData.order_id === orderId) {
            setReceiptData(parsedData);
            setLoading(false);
            return;
          }
        }
        
        // If we reach here, we need to fetch the data from an API
        // In a real application, you would make an API call to fetch receipt data
        fetchFromApi(orderId);
      } catch (err) {
        setError("Failed to load receipt data");
        setLoading(false);
      }
    };

    // Mock API call function - in a real app, this would be an actual API call
    const fetchFromApi = async (id) => {
      try {
        // Simulating API call delay
        setTimeout(() => {
          // This is where you would typically make a fetch/axios call to your backend
          // For demo purposes, we'll just show an error if no localStorage data is found
          setError("Receipt data not found. Please contact customer support with your order ID.");
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError("Failed to fetch receipt data from server");
        setLoading(false);
      }
    };

    if (orderId) {
      fetchReceiptData();
    } else {
      setError("No order ID provided");
      setLoading(false);
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-green-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Loading Receipt...</h2>
          <div className="mt-4 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-green-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
          <p className="mt-2 text-gray-600">Order ID: {orderId}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-green-600 px-6 py-4 text-center">
          <h2 className="text-3xl font-extrabold text-white">Receipt Details</h2>
          <p className="text-green-100 mt-1">Order #{receiptData.order_id}</p>
        </div>

        <div className="px-6 py-8">
          <div className="border-b pb-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Customer Information</h3>
            <p className="text-gray-700">Name: {receiptData.fullName}</p>
            {receiptData.email && <p className="text-gray-700">Email: {receiptData.email}</p>}
            {receiptData.phone && <p className="text-gray-700">Phone: {receiptData.phone}</p>}
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Order Details</h3>
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {receiptData.product_type?.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {item.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                        ${parseFloat(item.price || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                      Total
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600 text-right">
                      ${parseFloat(receiptData.total || 0).toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="flex justify-between items-center border-t pt-6">
            <div>
              <p className="text-sm text-gray-600">Payment Status: <span className="text-green-600 font-medium">Paid</span></p>
              <p className="text-sm text-gray-600 mt-1">Date: {receiptData.date || new Date().toLocaleDateString()}</p>
            </div>
            <button
              onClick={() => window.print()}
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print
            </button>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => navigate("/")}
              className="bg-gray-200 text-gray-800 py-2 px-6 rounded hover:bg-gray-300 transition"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receipt;