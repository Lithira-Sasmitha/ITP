import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Oderslidebar from "../../components/sidebar/oderslidebar";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const Orderhistory = () => {
  const [orderhistorys, setOrderhistorys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrderhistorys();
  }, []);

  const fetchOrderhistorys = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/orders/pending`);
      setOrderhistorys(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching pending orders:", error.response || error);
      setError("Failed to load pending orders. Please try again later.");
      setLoading(false);
    }
  };

  const handleProcessOrder = (order) => {
    // Removed order removal logic; order stays in list until delivery is created
    navigate(`/adddelivery/${order._id}`, { state: order });
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      setDeleteLoading(orderId);
      console.log(`Sending DELETE request for order ID: ${orderId}`); // Debug log
      const response = await axios.delete(`${API_URL}/orders/${orderId}`);
      console.log("Delete response:", response.data); // Debug log
      setOrderhistorys((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );
      setDeleteLoading(null);
    } catch (error) {
      console.error("Error deleting order:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      }); // Detailed error log
      alert(
        `Failed to delete the order: ${
          error.response?.data?.message || error.message
        }. Please check the server and try again.`
      );
      setDeleteLoading(null);
    }
  };

  const handleLocalDelete = (orderId) => {
    setOrderhistorys((prevOrders) =>
      prevOrders.filter((order) => order._id !== orderId)
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Oderslidebar />
        <div className="flex-1 p-6 flex items-center justify-center ml-64">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center w-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-700 font-medium">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Oderslidebar />
        <div className="flex-1 p-6 flex items-center justify-center ml-64">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full">
            <div className="flex items-center bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <svg
                className="h-6 w-6 text-red-500 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
            <button
              onClick={() => fetchOrderhistorys()}
              className="mt-4 w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 text-sm font-medium transition duration-150"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Oderslidebar />
      <div className="flex-1 p-6 overflow-y-auto ml-64">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Pending Orders</h1>
            <p className="text-sm text-gray-500">
              Manage and process your pending orders
            </p>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {orderhistorys.length === 0 ? (
              <div className="text-center p-10">
                <svg
                  className="h-16 w-16 mx-auto text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="mt-4 text-gray-600 font-medium">
                  No pending orders found
                </p>
                <button
                  onClick={() => fetchOrderhistorys()}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 text-sm font-medium transition duration-150"
                >
                  Refresh
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      {[
                        "Order ID",
                        "Customer",
                        "Product",
                        "Quantity",
                        "Item Price",
                        "Delivery Price",
                        "Total Price",
                        "Actions",
                      ].map((header) => (
                        <th
                          key={header}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orderhistorys.map((order) => (
                      <tr
                        key={order._id}
                        className="hover:bg-gray-50 transition duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order._id.substring(0, 8)}...
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {order.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {order.products.map((product, index) => (
                            <div key={index} className="mb-1 last:mb-0">
                              {product.productName}
                            </div>
                          ))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {order.products.map((product, index) => (
                            <div key={index} className="mb-1 last:mb-0">
                              {product.quantity}
                            </div>
                          ))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {order.products.map((product, index) => (
                            <div key={index} className="mb-1 last:mb-0">
                              ${product.price}
                            </div>
                          ))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          ${order.deliveryPrice}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            ${order.totalPrice}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleProcessOrder(order)}
                              className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 text-xs transition duration-150 flex items-center"
                              disabled={deleteLoading === order._id}
                            >
                              <svg
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                              Add Delivery
                            </button>
                            <button
                              onClick={() => handleDeleteOrder(order._id)}
                              className={`px-3 py-2 text-white rounded-lg text-xs transition duration-150 flex items-center ${
                                deleteLoading === order._id
                                  ? "bg-red-400 cursor-not-allowed"
                                  : "bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-500"
                              }`}
                              disabled={deleteLoading === order._id}
                            >
                              {deleteLoading === order._id ? (
                                <>
                                  <svg
                                    className="animate-spin h-4 w-4 mr-1 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    />
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                  </svg>
                                  Deleting...
                                </>
                              ) : (
                                <>
                                  <svg
                                    className="h-4 w-4 mr-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                  Delete
                                </>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orderhistory;
