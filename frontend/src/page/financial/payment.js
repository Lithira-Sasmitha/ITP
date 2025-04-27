import React, { useState, useEffect } from "react";
import axios from "axios";
import Fin_sidebar from "../../components/sidebar/fin_sidebar";

function Payment() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/payments/");
      setPayments(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching payments:", error);
      setLoading(false);
    }
  };

  const updatePaymentStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/payments/${id}`, {
        paymentStatus: newStatus,
      });
      // After successful update, refresh payment list
      fetchPayments();
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  const handleCorrectClick = (id) => {
    updatePaymentStatus(id, "Complete");
  };

  const handleIncorrectClick = (id) => {
    updatePaymentStatus(id, "Rejected");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="h-screen sticky top-0">
        <Fin_sidebar />
      </div>

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-md py-6 mb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-green-900">Payment Management</h1>
            <p className="text-green-600 mt-1">Manage Payment records</p>
          </div>
        </div>

        {/* Table Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-6 text-center">Loading...</div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gradient-to-r from-green-600 to-green-500">
                      <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">Total Amount (LKR)</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">Payment Status</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">Created At</th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-white uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payments.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.order_id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.fullName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.total?.toLocaleString()} LKR</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.paymentStatus}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(item.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap flex justify-center space-x-2">
                          {/* Conditionally render and disable buttons */}
                          {item.paymentStatus === "Pending" ? (
                            <>
                              <button
                                className="p-2 bg-green-100 rounded-md text-green-700 hover:bg-green-200 transition-colors text-sm font-semibold"
                                onClick={() => handleCorrectClick(item._id)}
                              >
                                ✅ Correct
                              </button>

                              <button
                                className="p-2 bg-red-100 rounded-md text-red-700 hover:bg-red-200 transition-colors text-sm font-semibold"
                                onClick={() => handleIncorrectClick(item._id)}
                              >
                                ❌ Incorrect
                              </button>
                            </>
                          ) : (
                            <>
                              {/* Disabled buttons when status is not "Pending" */}
                              <button
                                className="p-2 bg-gray-300 rounded-md text-gray-600 cursor-not-allowed text-sm font-semibold"
                                disabled
                              >
                                ✅ Correct
                              </button>

                              <button
                                className="p-2 bg-gray-300 rounded-md text-gray-600 cursor-not-allowed text-sm font-semibold"
                                disabled
                              >
                                ❌ Incorrect
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
