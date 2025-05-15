import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Oderslidebar from "../../components/sidebar/oderslidebar";
import { FaCheck, FaClock, FaExclamationCircle } from "react-icons/fa";
import { toast } from "react-toastify";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const DeliveryDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(
    location.state?.successMessage || ""
  );
  const [highlightedDeliveryId, setHighlightedDeliveryId] = useState(
    location.state?.newDeliveryId || ""
  );
  const [rowColors, setRowColors] = useState({});

  // Define fetchDeliveries outside of useEffect
  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/deliveries`);
      setDeliveries(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      setError("Failed to load deliveries. Please try again later.");
      setLoading(false);
    }
  };

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
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

  const handleStatusUpdate = async (deliveryId, newStatus) => {
    try {
      await axios.put(`${API_URL}/deliveries/status`, {
        deliveryId,
        status: newStatus
      });
      
      // Update the delivery status in the local state
      setDeliveries(prevDeliveries => 
        prevDeliveries.map(delivery => 
          delivery._id === deliveryId 
            ? { ...delivery, deliveryStatus: newStatus }
            : delivery
        )
      );
      
      toast.success(`Delivery status updated to ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update delivery status");
    }
  };

  const handleDelete = async (deliveryId) => {
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

  const filteredDeliveries = useMemo(() => {
    return deliveries.filter((delivery) =>
      delivery.orderId.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [deliveries, debouncedSearch]);

  const getRowColor = (deliveryStatus, deliveryId) => {
    if (highlightedDeliveryId && deliveryId === highlightedDeliveryId) {
      return "bg-green-300";
    }

    switch (deliveryStatus) {
      case "Completed":
        return "bg-green-100";
      case "Pending":
        return "bg-yellow-100";
      case "Delayed":
        return "bg-red-100";
      default:
        return "";
    }
  };

  const renderDeliveryStatus = (status) => {
    switch (status) {
      case "Pending":
        return (
          <span className="flex items-center text-yellow-600">
            <FaClock className="mr-1" /> Pending
          </span>
        );
      case "Delayed":
        return (
          <span className="flex items-center text-red-600">
            <FaExclamationCircle className="mr-1" /> Delayed
          </span>
        );
      case "Completed":
        return (
          <span className="flex items-center text-green-600">
            <FaCheck className="mr-1" /> Completed
          </span>
        );
      default:
        return status;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-green-100">
        <Oderslidebar />
        <div className="flex-1 p-6 flex items-center justify-center ml-64">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center w-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-700 font-medium">
              Loading deliveries...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-green-100">
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
              onClick={() => {
                setError("");
                setLoading(true);
                fetchDeliveries(); // Now accessible
              }}
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
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <Oderslidebar />
      <div className="flex-1 p-6 overflow-y-auto ml-64">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Delivery Management
              </h1>
              <p className="text-gray-600 mt-1">Manage and track all deliveries</p>
            </div>
            
          </div>

          {successMessage && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow-sm mb-6 animate-fade-in">
              <div className="flex items-center">
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

          <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-indigo-600 text-white sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                      Postal
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                      Tel
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                      Qty
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                      Items $
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                      Del $
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                      Delivery
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredDeliveries.length > 0 ? (
                    filteredDeliveries.map((delivery) => (
                      <tr
                        key={delivery._id}
                        className={`hover:bg-gray-50 transition-colors duration-200 ${getRowColor(
                          delivery.deliveryStatus,
                          delivery._id
                        )}`}
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {delivery.orderId}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {delivery.confirmOrderDate}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {delivery.customerName}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {delivery.address}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {delivery.postalCode}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {delivery.telephone}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-center">
                          {delivery.quantity}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          ${delivery.itemsPrice}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          ${delivery.deliveryPrice}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${delivery.totalPrice}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <span className="px-2 py-1 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                            {delivery.orderStatus || "Not Assigned"}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              delivery.deliveryStatus === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : delivery.deliveryStatus === "Delayed"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {renderDeliveryStatus(delivery.deliveryStatus)}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => handleStatusUpdate(delivery._id, "Completed")}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors shadow-sm hover:shadow-md transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                            >
                              Complete
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(delivery._id, "Pending")}
                              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors shadow-sm hover:shadow-md transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                            >
                              Pending
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(delivery._id, "Delayed")}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors shadow-sm hover:shadow-md transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                            >
                              Delay
                            </button>
                            <button
                              onClick={() => handleDelete(delivery._id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors shadow-sm hover:shadow-md transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="13" className="text-center py-10">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 mx-auto text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <p className="mt-2 text-sm text-gray-500">
                          No deliveries found
                        </p>
                        <p className="text-sm text-gray-500">
                          {search ? "Try changing your search criteria." : ""}
                        </p>
                        <button
                          onClick={() => {
                            setLoading(true);
                            fetchDeliveries();
                          }}
                          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 text-sm font-medium transition duration-150 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                          Refresh
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDetail;
