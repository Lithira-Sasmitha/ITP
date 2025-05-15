import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, orderDetails } = location.state || {};

  if (!orderId || !orderDetails) {
    return (
      <div className="min-h-screen bg-green-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">Order information not found.</p>
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
        <div className="bg-green-600 px-6 py-4">
          <div className="flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-white"
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
          </div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-white">
            Order Placed Successfully!
          </h2>
        </div>

        <div className="px-6 py-8">
          <div className="border-b pb-4 mb-4">
            <p className="text-sm text-gray-500">Order ID</p>
            <p className="text-lg font-medium">{orderId}</p>
          </div>

          <h3 className="text-xl font-semibold mb-4">Customer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{orderDetails.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{orderDetails.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-medium">{orderDetails.address}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Postal Code</p>
              <p className="font-medium">{orderDetails.postalCode}</p>
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-4">Order Details</h3>
          <div className="space-y-4 mb-6">
            {orderDetails.products.map((product, index) => (
              <div
                key={index}
                className="flex justify-between py-2 px-4 bg-gray-50 rounded-lg"
              >
                <span>{product.productName}</span>
                <span>
                  {product.quantity} x ${product.price} = $
                  {(product.quantity * product.price).toFixed(2)}
                </span>
              </div>
            ))}

            <div className="flex justify-between py-2 px-4">
              <span className="font-medium">Delivery Price</span>
              <span>${orderDetails.deliveryPrice}</span>
            </div>

            <div className="flex justify-between py-2 px-4 bg-green-100 rounded-lg">
              <span className="font-bold">Total</span>
              <span className="font-bold">${orderDetails.totalPrice}</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate("/product")}
              className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition"
            >
              Continue Shopping
            </button>
            {/* <button
              onClick={() => navigate("/orders/track", { state: { orderId } })}
              className="bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition"
            >
              Track Order
            </button> */}
            <button
            onClick={() => navigate("/paymentForm", { 
              state: {
                total: orderDetails.totalPrice,
                deliveryPrice: orderDetails.deliveryPrice,
                orderId: orderId,
                fullName: orderDetails.name,
              }
            })}            
  className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition"
>
  Proceed to Payment
</button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;