import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const AddDelivery = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = useParams();
  const orderData = location.state;

  // State to store delivery details
  const [deliveryDetails, setDeliveryDetails] = useState({
    orderId: "",
    customerName: "",
    address: "",
    postalCode: "",
    telephone: "",
    quantity: 0,
    oneItemPrice: "",
    itemsPrice: "",
    deliveryPrice: "",
    totalPrice: "",
    orderDate: "",
    confirmOrderDate: new Date().toISOString().split("T")[0],
    orderStatus: "Success",
    deliveryStatus: "Pending",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    // If orderData is available from the navigation state, use it
    if (orderData) {
      setDeliveryDetails({
        orderId: orderData._id || "ORD" + Date.now().toString().slice(-6),
        customerName: orderData.name || "",
        address: orderData.address || "",
        postalCode: orderData.postalCode || "",
        telephone: orderData.telephone || "",
        quantity: orderData.products
          ? orderData.products.reduce(
              (total, product) => total + product.quantity,
              0
            )
          : 1,
        oneItemPrice:
          orderData.products && orderData.products.length > 0
            ? orderData.products[0].price.toString().replace("$", "")
            : "0",
        itemsPrice: orderData.products
          ? orderData.products
              .reduce(
                (total, product) => total + product.price * product.quantity,
                0
              )
              .toString()
              .replace("$", "")
          : "0",
        deliveryPrice: (orderData.deliveryPrice || "0")
          .toString()
          .replace("$", ""),
        totalPrice: (orderData.totalPrice || "0").toString().replace("$", ""),
        orderDate: new Date(
          orderData.createdAt || Date.now()
        ).toLocaleDateString(),
        confirmOrderDate: new Date().toISOString().split("T")[0],
        orderStatus: "Success",
        deliveryStatus: "Pending",
      });
    }
    // If orderData is not available but orderId is, fetch the order data
    else if (orderId) {
      const fetchOrderDetails = async () => {
        try {
          const response = await axios.get(`${API_URL}/orders/${orderId}`);
          const order = response.data;

          setDeliveryDetails({
            orderId: order._id || "ORD" + Date.now().toString().slice(-6),
            customerName: order.name || "",
            address: order.address || "",
            postalCode: order.postalCode || "",
            telephone: order.telephone || "",
            quantity: order.products
              ? order.products.reduce(
                  (total, product) => total + product.quantity,
                  0
                )
              : 1,
            oneItemPrice:
              order.products && order.products.length > 0
                ? order.products[0].price.toString().replace("$", "")
                : "0",
            itemsPrice: order.products
              ? order.products
                  .reduce(
                    (total, product) =>
                      total + product.price * product.quantity,
                    0
                  )
                  .toString()
                  .replace("$", "")
              : "0",
            deliveryPrice: (order.deliveryPrice || "0")
              .toString()
              .replace("$", ""),
            totalPrice: (order.totalPrice || "0").toString().replace("$", ""),
            orderDate: new Date(
              order.createdAt || Date.now()
            ).toLocaleDateString(),
            confirmOrderDate: new Date().toISOString().split("T")[0],
            orderStatus: "Success",
            deliveryStatus: "Pending",
          });
        } catch (error) {
          console.error("Error fetching order details:", error);
          setSubmitError("Failed to fetch order details. Please try again.");
        }
      };

      fetchOrderDetails();
    } else {
      // If no order data and no orderId, create a manual entry form
      setDeliveryDetails({
        ...deliveryDetails,
        orderId: "ORD" + Date.now().toString().slice(-6),
      });
    }
  }, [orderData, orderId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryDetails({
      ...deliveryDetails,
      [name]: value,
    });
  };

  const handleSubmitDelivery = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      // Clean the data before sending
      const cleanedData = {
        ...deliveryDetails,
        // Remove dollar signs from all price fields
        oneItemPrice: deliveryDetails.oneItemPrice.replace(/\$/g, ""),
        itemsPrice: deliveryDetails.itemsPrice.replace(/\$/g, ""),
        deliveryPrice: deliveryDetails.deliveryPrice.replace(/\$/g, ""),
        totalPrice: deliveryDetails.totalPrice.replace(/\$/g, ""),
        // Ensure proper format for dates
        confirmOrderDate: new Date(deliveryDetails.confirmOrderDate)
          .toISOString()
          .split("T")[0],
      };

      // Log the data being sent
      console.log("Sending delivery data:", cleanedData);

      // Create a new delivery
      const response = await axios.post(`${API_URL}/deliveries`, cleanedData);

      console.log("Delivery created:", response.data);

      // Navigate to the delivery detail page with success message
      navigate("/deliverydetail", {
        state: {
          successMessage: "Delivery created successfully",
          newDeliveryId: response.data._id,
        },
      });
    } catch (error) {
      console.error(
        "Error creating delivery:",
        error.response ? error.response.data : error.message
      );
      setSubmitError(
        `Failed to create delivery: ${
          error.response ? error.response.data.message : error.message
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-400 py-6 px-8">
          <h1 className="text-3xl font-bold text-white">
            Delivery Information
          </h1>
          <p className="text-green-100 mt-2">
            Create a new delivery record for order tracking
          </p>
        </div>

        {/* Error Message */}
        {submitError && (
          <div className="mx-8 mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{submitError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form className="px-8 py-6" onSubmit={handleSubmitDelivery}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Order Information */}
            <div className="col-span-2">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
                Order Information
              </h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order ID
              </label>
              <input
                type="text"
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out"
                name="orderId"
                value={deliveryDetails.orderId}
                onChange={handleInputChange}
                required
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order Date
              </label>
              <input
                type="text"
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out"
                name="orderDate"
                value={deliveryDetails.orderDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Order Date
              </label>
              <input
                type="date"
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out"
                name="confirmOrderDate"
                value={deliveryDetails.confirmOrderDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order Status
              </label>
              <select
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out"
                name="orderStatus"
                value={deliveryDetails.orderStatus}
                onChange={handleInputChange}
                required
              >
                <option value="Pending">Pending</option>
                <option value="Success">Success</option>
                <option value="Failed">Failed</option>
                <option value="Canceled">Canceled</option>
              </select>
            </div>

            {/* Customer Information */}
            <div className="col-span-2">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4 mt-4">
                Customer Information
              </h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name
              </label>
              <input
                type="text"
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out"
                name="customerName"
                value={deliveryDetails.customerName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telephone
              </label>
              <input
                type="text"
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out"
                name="telephone"
                value={deliveryDetails.telephone}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out"
                name="address"
                value={deliveryDetails.address}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Postal Code
              </label>
              <input
                type="text"
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out"
                name="postalCode"
                value={deliveryDetails.postalCode}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Status
              </label>
              <select
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out"
                name="deliveryStatus"
                value={deliveryDetails.deliveryStatus}
                onChange={handleInputChange}
                required
              >
                <option value="Pending">Pending</option>
                <option value="Delayed">Delayed</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Pricing Information */}
            <div className="col-span-2">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4 mt-4">
                Pricing Details
              </h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out"
                name="quantity"
                value={deliveryDetails.quantity}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                One Item Price
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="text"
                  className="w-full p-3 pl-8 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out"
                  name="oneItemPrice"
                  value={deliveryDetails.oneItemPrice}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Items Total Price
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="text"
                  className="w-full p-3 pl-8 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out"
                  name="itemsPrice"
                  value={deliveryDetails.itemsPrice}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Price
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="text"
                  className="w-full p-3 pl-8 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out"
                  name="deliveryPrice"
                  value={deliveryDetails.deliveryPrice}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Total Price */}
          <div className="mt-8 mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-700">
                Total Price:
              </span>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-800 font-bold sm:text-lg">$</span>
                </div>
                <input
                  type="text"
                  className="p-3 pl-8 bg-white text-lg font-bold text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out"
                  name="totalPrice"
                  value={deliveryDetails.totalPrice}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-8">
            <button
              type="button"
              className="mr-4 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
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
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Create Delivery
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDelivery;
