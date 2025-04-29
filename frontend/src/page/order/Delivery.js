import Oderslidebar from "../../components/sidebar/oderslidebar";
import React, { useState, useEffect } from "react";
import {
  FaBox,
  FaClock,
  FaCheck,
  FaExclamationCircle,
  FaMoneyBill,
  FaTrash,
  FaUser,
  FaMoon,
  FaSun,
  FaHistory,
  FaCar,
  FaUserPlus,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useGetDriversQuery } from "../../page/order/redux/api/driverApiSlice";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export default function Delivery() {
  // State declarations
  const [deliveries, setDeliveries] = useState([]);
  const [pendingDeliveries, setPendingDeliveries] = useState(0);
  const [completedDeliveries, setCompletedDeliveries] = useState(0);
  const [delayedDeliveries, setDelayedDeliveries] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalDeliveredItems, setTotalDeliveredItems] = useState(0);
  const [totalDrivers, setTotalDrivers] = useState(0);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [orderHistoryData, setOrderHistoryData] = useState({
    totalDeliveryEarnings: 0,
    totalItemEarnings: 0,
    totalEarnings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showAssignDriverModal, setShowAssignDriverModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [showNoDriversModal, setShowNoDriversModal] = useState(false);

  // Navigation hook
  const navigate = useNavigate();

  const priceFormatter = new Intl.NumberFormat("en-LK", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const { data: driversData } = useGetDriversQuery();

  useEffect(() => {
    if (driversData) {
      setTotalDrivers(driversData.length);
    }
  }, [driversData]);

  const fetchDeliveries = async () => {
    try {
      console.log("Fetching deliveries from:", `${API_URL}/deliveries`);
      const response = await axios.get(`${API_URL}/deliveries`);
      const fetchedDeliveries = response.data;
      console.log("Fetched Deliveries:", fetchedDeliveries);
      setDeliveries(fetchedDeliveries);
      setLoading(false);

      setPendingDeliveries(
        fetchedDeliveries.filter((d) => d.deliveryStatus === "Pending").length
      );
      const completedCount = fetchedDeliveries.filter((d) => d.deliveryStatus === "Completed").length;
      console.log("Completed Deliveries:", completedCount);
      setCompletedDeliveries(completedCount);

      setDelayedDeliveries(
        fetchedDeliveries.filter((d) => d.deliveryStatus === "Delayed").length
      );

      const totalDeliveryEarnings = fetchedDeliveries.reduce(
        (sum, d) => sum + (parseFloat(d.deliveryPrice) || 0),
        0
      );
      const totalItemEarnings = fetchedDeliveries.reduce(
        (sum, d) => sum + (parseFloat(d.itemsPrice) || 0),
        0
      );

      setTotalEarnings(totalDeliveryEarnings);
      setTotalDeliveredItems(totalItemEarnings);
    } catch (err) {
      console.error("Error fetching deliveries:", err);
      setError("Failed to fetch deliveries");
      setLoading(false);
      toast.error("Failed to fetch deliveries");
    }
  };

  const fetchOrderHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/orders/pending`);
      const orders = response.data;

      const deliveryEarnings = orders.reduce(
        (sum, o) => sum + (parseFloat(o.deliveryPrice) || 0),
        0
      );
      const itemEarnings = orders.reduce(
        (sum, o) =>
          sum +
          o.products.reduce((ps, p) => ps + (p.price * p.quantity || 0), 0),
        0
      );

      setOrderHistoryData({
        totalDeliveryEarnings: deliveryEarnings,
        totalItemEarnings: itemEarnings,
        totalEarnings: deliveryEarnings + itemEarnings,
      });
    } catch (error) {
      console.error("Error fetching order history:", error);
      setError("Failed to load order history earnings data.");
      toast.error("Failed to load order history");
    }
  };

  const fetchDrivers = async () => {
    try {
      const driverResponse = await axios.get(`${API_URL}/drivers`);
      const driversList = driverResponse.data;

      const deliveryResponse = await axios.get(
        `${API_URL}/deliveries?deliveryStatus=Pending`
      );
      const deliveriesList = deliveryResponse.data;

      const driversWithStatus = driversList.map((driver) => {
        const isAssigned = deliveriesList.some(
          (delivery) =>
            delivery.assignedDriver &&
            delivery.assignedDriver._id === driver._id &&
            delivery.deliveryStatus === "Pending"
        );
        return { ...driver, isAssigned };
      });

      setDrivers(driversWithStatus);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      toast.error("Failed to load drivers");
    }
  };

  useEffect(() => {
    console.log("Starting data load");
    const loadData = async () => {
      await Promise.all([
        fetchDeliveries(),
        fetchDrivers(),
        fetchOrderHistory(),
      ]);
    };
    loadData();
  }, []);

  // Control alert visibility for zero completed deliveries
  useEffect(() => {
    if (!loading && completedDeliveries === 0) {
      console.log("Triggering alert for zero completed deliveries");
      setShowAlert(true);
      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => setShowAlert(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [loading, completedDeliveries]);

  const handleDismissAlert = () => {
    setShowAlert(false);
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const openAssignDriverModal = (delivery) => {
    if (delivery.assignedDriver) {
      toast.info("This delivery already has an assigned driver");
      return;
    }

    const availableDrivers = drivers.filter((driver) => !driver.isAssigned);
    if (availableDrivers.length === 0) {
      setShowNoDriversModal(true);
      return;
    }

    setSelectedDelivery(delivery);
    setShowAssignDriverModal(true);
  };

  const handleDriverSelect = (driver) => {
    if (!driver.isAssigned) {
      setSelectedDriver(driver);
    } else {
      toast.error("This driver is already assigned to another delivery");
    }
  };

  const handleAssignDriver = async () => {
    try {
      if (!selectedDriver || !selectedDelivery) {
        toast.error("Please select a driver");
        return;
      }

      const response = await axios.put(
        `${API_URL}/deliveries/${selectedDelivery._id}`,
        {
          assignedDriver: {
            id: selectedDriver._id,
            name: selectedDriver.name,
            vehicle: selectedDriver.vehicle,
            vehicleRegNo: selectedDriver.vehicleRegNo,
          },
        }
      );

      if (response.status === 200) {
        const updatedDelivery = response.data.delivery;
        setDeliveries((prevDeliveries) =>
          prevDeliveries.map((delivery) =>
            delivery._id === updatedDelivery._id ? updatedDelivery : delivery
          )
        );

        await fetchDrivers();

        toast.success(`Driver ${selectedDriver.name} assigned successfully!`);
      }

      setShowAssignDriverModal(false);
      setSelectedDriver(null);
      setSelectedDelivery(null);
    } catch (error) {
      console.error("Error assigning driver:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to assign driver. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleStatusUpdate = async (deliveryId, newStatus) => {
    try {
      const response = await axios.put(`${API_URL}/deliveries/status`, {
        deliveryId,
        status: newStatus,
      });

      if (response.status === 200) {
        toast.success(`Delivery status updated to ${newStatus}`);
        await fetchDeliveries();
        await fetchDrivers();
      }
    } catch (err) {
      setError("Failed to update delivery status");
      toast.error("Failed to update delivery status");
    }
  };

  const handleDeleteDelivery = async (deliveryId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/deliveries/${deliveryId}`
      );
      if (response.status === 200) {
        toast.success("Delivery deleted successfully");
        await fetchDeliveries();
        await fetchDrivers();
      }
    } catch (err) {
      toast.error("Failed to delete delivery");
      console.error("Error deleting delivery:", err);
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

  const renderDriverInfo = (delivery) => {
    if (!delivery.assignedDriver) {
      return (
        <div className="flex items-center text-gray-500">
          <FaUser className="mr-2" />
          <span>No driver assigned</span>
        </div>
      );
    }

    return (
      <div className="flex flex-col space-y-1 p-2 bg-blue-50 rounded-lg">
        <div className="flex items-center">
          <FaUser className="mr-2 text-blue-500" />
          <span className="font-semibold text-blue-600">
            {delivery.assignedDriver.name}
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <FaCar className="mr-2 text-gray-500" />
          <span>{delivery.assignedDriver.vehicle}</span>
          {delivery.assignedDriver.vehicleRegNo && (
            <span className="ml-1 text-gray-500">
              ({delivery.assignedDriver.vehicleRegNo})
            </span>
          )}
        </div>
      </div>
    );
  };

  // Pie chart data
  const chartData = {
    labels: ["Completed Deliveries", "Other Deliveries"],
    datasets: [
      {
        data: [completedDeliveries, deliveries.length - completedDeliveries],
        backgroundColor: ["#3B82F6", "#F43F5E"], // Blue, Rose
        hoverBackgroundColor: ["#2563EB", "#E11D48"], // Darker blue, darker rose
        borderColor: darkMode ? "#1F2937" : "#FFFFFF",
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: darkMode ? "#D1D5DB" : "#4B5563",
        },
      },
      tooltip: {
        backgroundColor: darkMode ? "#1F2937" : "#FFFFFF",
        titleColor: darkMode ? "#D1D5DB" : "#4B5563",
        bodyColor: darkMode ? "#D1D5DB" : "#4B5563",
        borderColor: darkMode ? "#4B5563" : "#D1D5DB",
        borderWidth: 1,
      },
    },
  };

  const AssignDriverModal = ({ drivers }) => {
    if (!showAssignDriverModal) return null;

    const availableDrivers = drivers.filter((driver) => !driver.isAssigned);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-3xl shadow-xl">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Assign Driver
          </h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Available Driver
            </label>
            {availableDrivers.length === 0 ? (
              <p className="text-red-600 font-medium">
                No available drivers. All drivers are assigned to pending
                deliveries.
              </p>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Driver Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vehicle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {availableDrivers.map((driver) => (
                    <tr key={driver._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {driver.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {driver.vehicle} ({driver.vehicleRegNo})
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => {
                            handleDriverSelect(driver);
                            handleAssignDriver();
                          }}
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                        >
                          Assign
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => {
                setShowAssignDriverModal(false);
                setSelectedDriver(null);
                setSelectedDelivery(null);
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-150"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const NoDriversModal = () => {
    if (!showNoDriversModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
          <div className="flex items-center mb-4">
            <FaExclamationCircle className="text-red-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">
              No Drivers Available
            </h2>
          </div>
          <p className="text-gray-600 mb-4">
            There are no drivers available to assign to this delivery. Please
            add a new driver to continue.
          </p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setShowNoDriversModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-150"
            >
              Close
            </button>
            <button
              onClick={() => {
                setShowNoDriversModal(false);
                navigate("/drivervehicledetails");
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            >
              Add Driver
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading)
    return <div className="text-center text-gray-600 text-lg">Loading...</div>;
  if (error)
    return (
      <div className="text-center text-red-600 text-lg">Error: {error}</div>
    );

  return (
    <div
      className={`flex h-screen ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white"
          : "bg-gradient-to-br from-gray-100 to-gray-50 text-gray-900"
      } transition-all duration-500`}
    >
      <div
        className={`w-[260px] h-screen shadow-2xl z-10 ${
          darkMode ? "bg-gray-800" : "bg-white"
        } transition-colors duration-300`}
      >
        <Oderslidebar />
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        <div
          className={`flex justify-between items-center p-6 rounded-3xl shadow-2xl transition-all duration-500 ${
            darkMode
              ? "bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700"
              : "bg-gradient-to-r from-white to-gray-50 border border-gray-200"
          }`}
        >
          <div>
            <h1 className="text-4xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Order & Deliver Dashboard
            </h1>
            <p
              className={`text-md transition-colors duration-300 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Order & Delivery Management Overview
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className={`p-3 rounded-full transition-all duration-300 transform hover:rotate-12 hover:scale-110 ${
                darkMode
                  ? "bg-yellow-500 text-gray-900 hover:bg-yellow-400"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {darkMode ? <FaSun size={24} /> : <FaMoon size={24} />}
            </button>
          </div>
        </div>

        {/* Zero Completed Deliveries Alert */}
        {showAlert && (
          <div className="fixed top-4 right-4 z-50 max-w-sm bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-lg flex items-center space-x-2 animate-slide-in">
            <FaExclamationTriangle className="text-red-700 w-5 h-5" />
            <p className="font-semibold">
              No completed deliveries found. Please review pending or delayed deliveries.
            </p>
            <button
              onClick={handleDismissAlert}
              className="text-red-700 hover:text-red-900 focus:outline-none"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <DashboardCard
            icon={<FaBox />}
            title="Total Deliveries"
            value={deliveries.length}
            color="emerald"
            darkMode={darkMode}
          />
          <DashboardCard
            icon={<FaClock />}
            title="Pending"
            value={pendingDeliveries}
            color="amber"
            darkMode={darkMode}
          />
          <DashboardCard
            icon={<FaCheck />}
            title="Completed"
            value={completedDeliveries}
            color="blue"
            darkMode={darkMode}
          />
          <DashboardCard
            icon={<FaExclamationCircle />}
            title="Delayed"
            value={delayedDeliveries}
            color="rose"
            darkMode={darkMode}
          />
        </div>

        {/* Pie Chart Section */}
        <div
          className={`p-6 rounded-3xl shadow-xl transition-all duration-500 ${
            darkMode
              ? "bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700"
              : "bg-gradient-to-r from-white to-gray-50 border border-gray-200"
          }`}
        >
          <h2 className="text-xl font-semibold mb-4">Delivery Status</h2>
          <div className="relative h-64">
            <Pie data={chartData} options={chartOptions} />
          </div>
        </div>

        <div
          className={`p-6 rounded-3xl shadow-2xl transition-all duration-500 ${
            darkMode
              ? "bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700"
              : "bg-gradient-to-r from-white to-gray-50 border border-gray-200"
          }`}
        >
          <div className="flex items-center mb-6 space-x-3">
            <FaHistory className="text-2xl text-indigo-500" />
            <h2 className="text-2xl font-semibold">Earnings Overview</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <EarningsCard
              title="Delivery Earnings"
              value={priceFormatter.format(
                orderHistoryData.totalDeliveryEarnings
              )}
              icon={<FaMoneyBill />}
              color="green"
              darkMode={darkMode}
            />
            <EarningsCard
              title="Item Earnings"
              value={priceFormatter.format(orderHistoryData.totalItemEarnings)}
              icon={<FaMoneyBill />}
              color="blue"
              darkMode={darkMode}
            />
            <EarningsCard
              title="Total Earnings"
              value={priceFormatter.format(orderHistoryData.totalEarnings)}
              icon={<FaMoneyBill />}
              color="indigo"
              darkMode={darkMode}
            />
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Recent Deliveries</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Driver Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned Driver
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {deliveries.map((delivery) => (
                  <tr key={delivery._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {delivery.orderId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900">
                          {delivery.customerName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {delivery.address}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderDeliveryStatus(delivery.deliveryStatus)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {delivery.assignedDriver
                        ? delivery.assignedDriver.name
                        : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="min-w-[200px]">
                        {renderDriverInfo(delivery)}
                        {!delivery.assignedDriver && (
                          <button
                            onClick={() => openAssignDriverModal(delivery)}
                            className="mt-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-1.5 rounded-full text-sm flex items-center space-x-1 shadow-sm hover:shadow-md transition-all duration-200"
                          >
                            <FaUserPlus className="text-xs" />
                            <span>Assign Driver</span>
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Rs. {delivery.totalPrice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      {delivery.deliveryStatus === "Pending" && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(delivery._id, "Completed")
                          }
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition duration-150"
                        >
                          Complete
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteDelivery(delivery._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center text-sm transition duration-150"
                      >
                        <FaTrash className="mr-1" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AssignDriverModal drivers={drivers} />
      <NoDriversModal />
    </div>
  );
}

function DashboardCard({ icon, title, value, color, darkMode }) {
  return (
    <div
      className={`p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 ${
        darkMode
          ? `bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700`
          : `bg-gradient-to-r from-white to-gray-50 border border-gray-200`
      }`}
    >
      <div className="flex items-center space-x-4">
        <div className={`text-4xl text-${color}-500`}>{icon}</div>
        <div>
          <h2 className={`text-3xl font-bold text-${color}-600`}>{value}</h2>
          <p
            className={`text-sm transition-colors duration-300 ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {title}
          </p>
        </div>
      </div>
    </div>
  );
}

function EarningsCard({ title, value, icon, color, darkMode }) {
  return (
    <div
      className={`p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 ${
        darkMode
          ? `bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700`
          : `bg-gradient-to-r from-white to-gray-50 border border-gray-200`
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p
            className={`text-sm mb-2 transition-colors duration-300 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {title}
          </p>
          <h3 className={`text-2xl font-bold text-${color}-500`}>
            Rs. {value}
          </h3>
        </div>
        <div className={`text-3xl text-${color}-500`}>{icon}</div>
      </div>
    </div>
  );
}