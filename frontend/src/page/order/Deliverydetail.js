import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const DeliveryDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(
    location.state?.successMessage || ""
  );
  const [highlightedDeliveryId, setHighlightedDeliveryId] = useState(
    location.state?.newDeliveryId || ""
  );

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await axios.get(`${API_URL}/deliveries`);
        setDeliveries(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching deliveries:", error);
        setError("Failed to load deliveries. Please try again later.");
        setLoading(false);
      }
    };

    fetchDeliveries();

    // Clear success message and highlighted delivery after 5 seconds
    if (successMessage || highlightedDeliveryId) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setHighlightedDeliveryId("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, highlightedDeliveryId]);

  const handleStatusChange = async (deliveryId, status) => {
    try {
      setLoading(true);
      await axios.patch(`${API_URL}/deliveries/${deliveryId}`, {
        deliveryStatus: status,
      });

      setDeliveries(
        deliveries.map((delivery) =>
          delivery._id === deliveryId
            ? { ...delivery, deliveryStatus: status }
            : delivery
        )
      );

      setSuccessMessage(`Delivery status updated to ${status}`);
      setLoading(false);
    } catch (error) {
      console.error("Error updating delivery status:", error);
      setError("Failed to update delivery status. Please try again later.");
      setLoading(false);
    }
  };

  const handleDelete = async (deliveryId) => {
    // Show confirmation dialog
    if (!window.confirm("Are you sure you want to delete this delivery?")) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`${API_URL}/deliveries/${deliveryId}`);
      setDeliveries(
        deliveries.filter((delivery) => delivery._id !== deliveryId)
      );
      setSuccessMessage("Delivery deleted successfully");
      setLoading(false);
    } catch (error) {
      console.error("Error deleting delivery:", error);
      setError("Failed to delete delivery. Please try again later.");
      setLoading(false);
    }
  };

  const handleAddNewDelivery = () => {
    navigate("/orders");
  };

  const filteredDeliveries = deliveries.filter((delivery) =>
    delivery.orderId.toLowerCase().includes(search.toLowerCase())
  );

  const getRowColor = (deliveryStatus, deliveryId) => {
    // If this is the newly created delivery, highlight it
    if (highlightedDeliveryId && deliveryId === highlightedDeliveryId) {
      return "bg-green-300";
    }

    // Regular status-based coloring
    if (deliveryStatus === "Pending") return "bg-yellow-100";
    if (deliveryStatus === "Delayed") return "bg-blue-100";
    if (deliveryStatus === "Completed") return "bg-green-100";
    return "";
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-700 font-medium">
            Loading deliveries...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="bg-red-50 border border-red-300 text-red-700 px-6 py-4 rounded-lg shadow-sm max-w-4xl mx-auto">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
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
            onClick={() => {
              setError("");
              setLoading(true);
              window.location.reload();
            }}
            className="mt-4 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors shadow-sm font-medium flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-full mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Delivery Management
          </h1>
        </div>

        {successMessage && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow-sm mb-6 animate-pulse">
            <div className="flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="font-medium">{successMessage}</p>
            </div>
          </div>
        )}

        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="Search Deliveries by Order ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2 pl-1">
            {filteredDeliveries.length} deliveries found
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="w-full">
            <table className="w-full table-fixed border-collapse">
              <thead>
                <tr className="bg-indigo-600 text-white">
                  <th className="p-2 text-left font-semibold text-xs w-1/12">
                    Order ID
                  </th>
                  <th className="p-2 text-left font-semibold text-xs w-1/12">
                    Date
                  </th>
                  <th className="p-2 text-left font-semibold text-xs w-1/12">
                    Customer
                  </th>
                  <th className="p-2 text-left font-semibold text-xs w-1/12">
                    Address
                  </th>
                  <th className="p-2 text-left font-semibold text-xs w-1/12">
                    Postal
                  </th>
                  <th className="p-2 text-left font-semibold text-xs w-1/12">
                    Tel
                  </th>
                  <th className="p-2 text-left font-semibold text-xs w-1/24">
                    Qty
                  </th>
                  <th className="p-2 text-left font-semibold text-xs w-1/12">
                    Items $
                  </th>
                  <th className="p-2 text-left font-semibold text-xs w-1/12">
                    Del $
                  </th>
                  <th className="p-2 text-left font-semibold text-xs w-1/12">
                    Total
                  </th>
                  <th className="p-2 text-left font-semibold text-xs w-1/12">
                    Order
                  </th>
                  <th className="p-2 text-left font-semibold text-xs w-1/12">
                    Delivery
                  </th>
                  <th className="p-2 text-left font-semibold text-xs w-1/6">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDeliveries.length > 0 ? (
                  filteredDeliveries.map((delivery) => (
                    <tr
                      key={delivery._id}
                      className={`hover:bg-gray-50 transition-colors ${getRowColor(
                        delivery.deliveryStatus,
                        delivery._id
                      )}`}
                    >
                      <td className="p-2 border-t border-gray-200 text-xs truncate">
                        {delivery.orderId}
                      </td>
                      <td className="p-2 border-t border-gray-200 text-xs truncate">
                        {delivery.confirmOrderDate}
                      </td>
                      <td className="p-2 border-t border-gray-200 text-xs font-medium truncate">
                        {delivery.customerName}
                      </td>
                      <td className="p-2 border-t border-gray-200 text-xs truncate">
                        {delivery.address}
                      </td>
                      <td className="p-2 border-t border-gray-200 text-xs truncate">
                        {delivery.postalCode}
                      </td>
                      <td className="p-2 border-t border-gray-200 text-xs truncate">
                        {delivery.telephone}
                      </td>
                      <td className="p-2 border-t border-gray-200 text-xs text-center">
                        {delivery.quantity}
                      </td>
                      <td className="p-2 border-t border-gray-200 text-xs truncate">
                        {delivery.itemsPrice}
                      </td>
                      <td className="p-2 border-t border-gray-200 text-xs truncate">
                        {delivery.deliveryPrice}
                      </td>
                      <td className="p-2 border-t border-gray-200 text-xs font-medium truncate">
                        {delivery.totalPrice}
                      </td>
                      <td className="p-2 border-t border-gray-200 text-xs">
                        <span className="px-1 py-1 rounded text-xs font-medium bg-indigo-100 text-indigo-800 inline-block truncate max-w-full">
                          {delivery.orderStatus || "Not Assigned"}
                        </span>
                      </td>
                      <td className="p-2 border-t border-gray-200 text-xs">
                        <span
                          className={`px-1 py-1 rounded text-xs font-medium inline-block truncate max-w-full
                            ${
                              delivery.deliveryStatus === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : delivery.deliveryStatus === "Delayed"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                        >
                          {delivery.deliveryStatus || "Not Assigned"}
                        </span>
                      </td>
                      <td className="p-2 border-t border-gray-200">
                        <div className="flex flex-wrap gap-1">
                          <button
                            onClick={() =>
                              handleStatusChange(delivery._id, "Pending")
                            }
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-1 py-1 rounded text-xs font-medium transition-colors shadow-sm"
                          >
                            Pending
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(delivery._id, "Delayed")
                            }
                            className="bg-blue-500 hover:bg-blue-600 text-white px-1 py-1 rounded text-xs font-medium transition-colors shadow-sm"
                          >
                            Delayed
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(delivery._id, "Completed")
                            }
                            className="bg-green-500 hover:bg-green-600 text-white px-1 py-1 rounded text-xs font-medium transition-colors shadow-sm"
                          >
                            Completed
                          </button>
                          <button
                            onClick={() => handleDelete(delivery._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-1 py-1 rounded text-xs font-medium transition-colors shadow-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="13"
                      className="p-8 text-center text-gray-500 border-t border-gray-200"
                    >
                      <div className="flex flex-col items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 text-gray-400 mb-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <p className="font-medium">No deliveries found</p>
                        <p className="text-sm">
                          {search ? "Try changing your search criteria." : ""}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDetail;
