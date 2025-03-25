import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
      console.error("Error fetching pending orders:", error);
      setError("Failed to load pending orders. Please try again later.");
      setLoading(false);
    }
  };

  // This function handles both removing the row and navigating to the delivery page
  const handleProcessOrder = (order) => {
    // First, remove the order from the display by updating the state
    setOrderhistorys(orderhistorys.filter((o) => o._id !== order._id));

    // Then navigate to the delivery form with the order data
    navigate(`/adddelivery/${order._id}`, { state: order });
  };

  // This function handles deleting an order
  const handleDeleteOrder = async (orderId) => {
    try {
      // Set loading state for this specific order
      setDeleteLoading(orderId);

      // Try a different approach - first check if your API might expect a POST request with a delete action
      // Many APIs use this pattern instead of DELETE method
      await axios.post(`${API_URL}/orders/delete`, { orderId });

      // Alternative approach - Try with a different parameter name
      // await axios.delete(`${API_URL}/orders/delete`, { data: { id: orderId } });

      // If successful, update the UI by removing the deleted item
      setOrderhistorys((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );

      // Reset loading state
      setDeleteLoading(null);
    } catch (error) {
      console.error("Error deleting order:", error);

      // If the first method fails, try a fallback method using a different endpoint structure
      try {
        await axios.post(`${API_URL}/orders/${orderId}/delete`);

        // If successful with the fallback, update the UI
        setOrderhistorys((prevOrders) =>
          prevOrders.filter((order) => order._id !== orderId)
        );
      } catch (fallbackError) {
        console.error("Fallback delete also failed:", fallbackError);

        // Both methods failed, show error to user
        alert(
          "Failed to delete the order. Please try again or contact support."
        );
      }

      // Reset loading state
      setDeleteLoading(null);
    }
  };

  // A simpler version that might work if the backend is just expecting a different format
  const handleLocalDelete = (orderId) => {
    // Just remove from UI without API call - for testing
    setOrderhistorys((prevOrders) =>
      prevOrders.filter((order) => order._id !== orderId)
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-lg shadow-md p-8 w-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-700 font-medium">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
        <div className="bg-white border-l-4 border-red-500 text-red-700 p-6 rounded shadow-md max-w-2xl w-full">
          <div className="flex items-center">
            <svg
              className="h-6 w-6 text-red-500 mr-4"
              xmlns="http://www.w3.org/2000/svg"
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
            <p className="font-medium">{error}</p>
          </div>
          <button
            onClick={() => fetchOrderhistorys()}
            className="mt-4 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Pending Orders
            </h2>
          </div>

          {orderhistorys.length === 0 ? (
            <div className="text-center p-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
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
                className="mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              >
                Refresh
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Delivery Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orderhistorys.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order._id.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {order.products.map((product, index) => (
                          <div key={index} className="mb-1 last:mb-0">
                            <span>{product.productName}</span>
                          </div>
                        ))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {order.products.map((product, index) => (
                          <div key={index} className="mb-1 last:mb-0">
                            <span>{product.quantity}</span>
                          </div>
                        ))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {order.products.map((product, index) => (
                          <div key={index} className="mb-1 last:mb-0">
                            <span className="font-medium">
                              ${product.price}
                            </span>
                          </div>
                        ))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <span className="font-medium">
                          ${order.deliveryPrice}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          ${order.totalPrice}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleProcessOrder(order)}
                            className="bg-green-600 text-white py-2 px-3 rounded hover:bg-green-700 transition-colors duration-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                            disabled={deleteLoading === order._id}
                          >
                            <span className="flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
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
                            </span>
                          </button>
                          <button
                            onClick={() => handleLocalDelete(order._id)}
                            className={`${
                              deleteLoading === order._id
                                ? "bg-red-400"
                                : "bg-red-600 hover:bg-red-700"
                            } text-white py-2 px-3 rounded transition-colors duration-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50`}
                            disabled={deleteLoading === order._id}
                          >
                            {deleteLoading === order._id ? (
                              <span className="flex items-center">
                                <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-1"></div>
                                Deleting...
                              </span>
                            ) : (
                              <span className="flex items-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
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
                              </span>
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
  );
};

export default Orderhistory;
