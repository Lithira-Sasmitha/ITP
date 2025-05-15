import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Oderslidebar from "../../components/sidebar/oderslidebar";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const AddDelivery = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = useParams();
  const orderData = location.state;

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
    if (orderData) {
      setDeliveryDetails({
        orderId: orderData._id || "ORD" + Date.now().toString().slice(-6),
        customerName: orderData.name || "",
        address: orderData.address || "",
        postalCode: orderData.postalCode || "",
        telephone: orderData.telephone || orderData.phone || "",
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
    } else if (orderId) {
      const fetchOrderDetails = async () => {
        try {
          const response = await axios.get(`${API_URL}/orders/${orderId}`);
          const order = response.data;

          setDeliveryDetails({
            orderId: order._id || "ORD" + Date.now().toString().slice(-6),
            customerName: order.name || "",
            address: order.address || "",
            postalCode: order.postalCode || "",
            telephone: order.telephone || order.phone || "",
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
      const cleanedData = {
        ...deliveryDetails,
        oneItemPrice: deliveryDetails.oneItemPrice.replace(/\$/g, ""),
        itemsPrice: deliveryDetails.itemsPrice.replace(/\$/g, ""),
        deliveryPrice: deliveryDetails.deliveryPrice.replace(/\$/g, ""),
        totalPrice: deliveryDetails.totalPrice.replace(/\$/g, ""),
        confirmOrderDate: new Date(deliveryDetails.confirmOrderDate)
          .toISOString()
          .split("T")[0],
      };

      console.log("Sending delivery data:", cleanedData);

      // Create the delivery
      const response = await axios.post(`${API_URL}/deliveries`, cleanedData);

      console.log("Delivery created:", response.data);

      // Delete the order from pending orders after successful delivery creation
      try {
        await axios.post(`${API_URL}/orders/delete`, {
          orderId: cleanedData.orderId,
        });
        console.log("Order deleted from pending orders:", cleanedData.orderId);
      } catch (deleteError) {
        console.error(
          "Error deleting order after delivery creation:",
          deleteError
        );
        // Optionally handle fallback deletion
        try {
          await axios.post(`${API_URL}/orders/${cleanedData.orderId}/delete`);
          console.log("Order deleted via fallback:", cleanedData.orderId);
        } catch (fallbackError) {
          console.error("Fallback delete also failed:", fallbackError);
          // Log the error but proceed with navigation, as delivery was created
        }
      }

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
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Oderslidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Add New Delivery
            </h1>
            <p className="text-sm text-gray-500">
              Create a new delivery record for order tracking
            </p>
          </div>

          {/* Error Message */}
          {submitError && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-md flex items-center">
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
              <span className="text-sm text-red-700 font-medium">
                {submitError}
              </span>
            </div>
          )}

          {/* Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <form onSubmit={handleSubmitDelivery}>
              {/* Order Information */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
                  Order Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Order ID
                    </label>
                    <input
                      type="text"
                      name="orderId"
                      value={deliveryDetails.orderId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition duration-150"
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
                      name="orderDate"
                      value={deliveryDetails.orderDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition duration-150"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Order Date
                    </label>
                    <input
                      type="date"
                      name="confirmOrderDate"
                      value={deliveryDetails.confirmOrderDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition duration-150"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Order Status
                    </label>
                    <select
                      name="orderStatus"
                      value={deliveryDetails.orderStatus}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition duration-150"
                      required
                    >
                      <option value="Pending">Pending</option>
                      <option value="Success">Success</option>
                      <option value="Failed">Failed</option>
                      <option value="Canceled">Canceled</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
                  Customer Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={deliveryDetails.customerName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition duration-150"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telephone
                    </label>
                    <input
                      type="text"
                      name="telephone"
                      value={deliveryDetails.telephone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition duration-150"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={deliveryDetails.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition duration-150"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={deliveryDetails.postalCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition duration-150"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Status
                    </label>
                    <select
                      name="deliveryStatus"
                      value={deliveryDetails.deliveryStatus}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition duration-150"
                      required
                    >
                      <option value="Pending">Pending</option>
                      <option value="Delayed">Delayed</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Pricing Information */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
                  Pricing Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={deliveryDetails.quantity}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition duration-150"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      One Item Price
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                        $
                      </span>
                      <input
                        type="text"
                        name="oneItemPrice"
                        value={deliveryDetails.oneItemPrice}
                        onChange={handleInputChange}
                        className="w-full pl-8 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition duration-150"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Items Total Price
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                        $
                      </span>
                      <input
                        type="text"
                        name="itemsPrice"
                        value={deliveryDetails.itemsPrice}
                        onChange={handleInputChange}
                        className="w-full pl-8 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition duration-150"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Price
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                        $
                      </span>
                      <input
                        type="text"
                        name="deliveryPrice"
                        value={deliveryDetails.deliveryPrice}
                        onChange={handleInputChange}
                        className="w-full pl-8 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition duration-150"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Price */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-700">
                    Total Price:
                  </span>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-800 font-bold">
                      $
                    </span>
                    <input
                      type="text"
                      name="totalPrice"
                      value={deliveryDetails.totalPrice}
                      onChange={handleInputChange}
                      className="px-4 pl-8 py-2 bg-white text-lg font-bold text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-150"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 text-sm font-medium transition duration-150"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 text-sm font-medium transition duration-150 flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
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
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Create Delivery
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDelivery;
