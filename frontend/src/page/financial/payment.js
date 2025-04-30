import React, { useState, useEffect } from "react";
import axios from "axios";
import Fin_sidebar from "../../components/sidebar/fin_sidebar";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable'; // Import as a named export

function Payment() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // Search query state

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Payment Report", 14, 15);
    
    const tableColumn = ["Order ID", "Name", "Amount (LKR)", "Status", "Created At"];
    const tableRows = [];
  
    filteredPayments.forEach((item) => {
      const paymentData = [
        item.order_id,
        item.fullName,
        item.total?.toLocaleString(),
        item.paymentStatus,
        new Date(item.createdAt).toLocaleDateString()
      ];
      tableRows.push(paymentData);
    });
  
    // Use autoTable directly instead of doc.autoTable
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
    });
  
    doc.save("payment_report.pdf");
  };
  
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

  // Filter payments by name or order ID
  const filteredPayments = payments.filter((item) =>
    item.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.order_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="h-screen sticky top-0">
        <Fin_sidebar />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="bg-white shadow-md py-6 mb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-green-900">Payment Management</h1>
            <p className="text-green-600 mt-1">Manage Payment records</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 sm:space-x-4">
            <input
              type="text"
              placeholder="Search by Name or Order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-80 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm text-gray-700 placeholder-gray-400"
            />
            <button
              onClick={generatePDF}
              className="px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700 transition-all text-sm font-medium w-full sm:w-auto"
            >
              📄 Download PDF
            </button>
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
                      <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">Total Amount </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">Payment Status</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">Created At</th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-white uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPayments.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.order_id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.fullName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.total?.toLocaleString()} $</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-3 py-1 rounded-full font-semibold text-xs ${
                            item.paymentStatus === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : item.paymentStatus === "Complete"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.paymentStatus}
                        </span>
                      </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(item.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap flex justify-center space-x-2">
                          {item.paymentStatus === "Pending" ? (
                            <>
                              <button
                                className="p-2 bg-green-100 rounded-md text-green-700 hover:bg-green-200 transition-colors text-sm font-semibold"
                                onClick={() => handleCorrectClick(item._id)}
                              >
                                ✅ Complete
                              </button>
                              <button
                                className="p-2 bg-red-100 rounded-md text-red-700 hover:bg-red-200 transition-colors text-sm font-semibold"
                                onClick={() => handleIncorrectClick(item._id)}
                              >
                                ❌ Rejected
                              </button>
                            </>
                          ) : (
                            <>
                              <button className="p-2 bg-gray-300 rounded-md text-gray-600 cursor-not-allowed text-sm font-semibold" disabled>
                                ✅ Complete
                              </button>
                              <button className="p-2 bg-gray-300 rounded-md text-gray-600 cursor-not-allowed text-sm font-semibold" disabled>
                                ❌ Rejected
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                    {filteredPayments.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center py-6 text-gray-500">
                          No matching payments found.
                        </td>
                      </tr>
                    )}
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