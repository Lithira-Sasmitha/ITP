import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { total = 0, deliveryPrice = 0, orderId = "", fullName = "", selectedproduct_type = [] } = location.state || {};

  const payData = {
    order_id: orderId || "BK-20250425",
    fullName: fullName || "John Doe",
    selectedproduct_type: selectedproduct_type.length > 0
      ? selectedproduct_type
      : [
          { title: "Coco Peat Grow Bags", price: 3750 },
          { title: "5 Kg Coco Peat Bricks", price: 1500 },
          { title: "Delivery Price", price: 5 },
        ],
    total: total || 5255,
  };
  

  const [paymentForm, setPaymentForm] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  const [formErrors, setFormErrors] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentForm((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    let errors: any = {};

    // Validate card number
    if (!paymentForm.cardNumber.match(/^\d{16}$/)) {
      errors.cardNumber = "Card number must be 16 digits.";
    }

    // Validate name on card
    if (!paymentForm.cardName) {
      errors.cardName = "Card name is required.";
    }

    // Validate expiry date
    if (!paymentForm.expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
      errors.expiryDate = "Expiry date must be in MM/YY format.";
    }

    // Validate CVV
    if (!paymentForm.cvv.match(/^\d{3,4}$/)) {
      errors.cvv = "CVV must be 3 or 4 digits.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/payments/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_id: payData.order_id,
          fullName: payData.fullName,
          selectedproduct_type: payData.selectedproduct_type,
          total: payData.total,
          cardDetails: {
            cardNumber: paymentForm.cardNumber,
            nameOnCard: paymentForm.cardName,
            expiryDate: paymentForm.expiryDate,
            cvv: paymentForm.cvv,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process payment');
      }

      const data = await response.json();
      console.log('Payment stored successfully:', data);

      setLoading(false);
      setPaymentForm({
        cardNumber: "",
        cardName: "",
        expiryDate: "",
        cvv: "",
      });

      navigate("/payment-summary", {
        state: {
          order_id: payData.order_id,
          fullName: payData.fullName,
          product_type: payData.selectedproduct_type,
          total: payData.total,
          paymentDetails: {
            cardNumber: paymentForm.cardNumber,
            cardName: paymentForm.cardName,
            expiryDate: paymentForm.expiryDate,
            cvv: paymentForm.cvv,
          },
        },
      });
    } catch (err) {
      console.error('Payment error:', err);
      setError('Payment failed. Please try again.');
      setLoading(false);
    }
  };

  console.log(payData.orderId);

  return (
    <div className="min-h-screen bg-green-100 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-green-600 py-6 px-6 text-center">
            <h2 className="text-3xl font-extrabold text-white">Payment</h2>
          </div>

          <div className="px-6 py-8">
            {/* Booking Summary */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-green-700 mb-4">Order Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-medium">{payData.order_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{payData.fullName}</p>
                </div>
              </div>

              <ul className="divide-y divide-gray-200 mb-4">
                {payData.selectedproduct_type.map((item, index) => (
                  <li key={index} className="flex justify-between py-2">
                    <span>{item.title}</span>
                    <span>${item.price.toFixed(2)}</span>
                  </li>
                ))}
              </ul>

              <div className="flex justify-between py-2 border-t border-gray-200 font-bold">
                <span>Total</span>
                <span>${payData.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Card Payment Form */}
            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-100 text-red-700 rounded">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={paymentForm.cardNumber}
                  onChange={handleInputChange}
                  className={`w-full border ${formErrors.cardNumber ? "border-red-500" : "border-gray-300"} px-4 py-2 rounded-lg`}
                  placeholder="1234 5678 9012 3456"
                  maxLength={16}
                />
                {formErrors.cardNumber && <p className="text-red-600 text-sm">{formErrors.cardNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Name on Card</label>
                <input
                  type="text"
                  name="cardName"
                  value={paymentForm.cardName}
                  onChange={handleInputChange}
                  className={`w-full border ${formErrors.cardName ? "border-red-500" : "border-gray-300"} px-4 py-2 rounded-lg`}
                  placeholder="John Doe"
                />
                {formErrors.cardName && <p className="text-red-600 text-sm">{formErrors.cardName}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">Expiry Date</label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={paymentForm.expiryDate}
                    onChange={handleInputChange}
                    className={`w-full border ${formErrors.expiryDate ? "border-red-500" : "border-gray-300"} px-4 py-2 rounded-lg`}
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                  {formErrors.expiryDate && <p className="text-red-600 text-sm">{formErrors.expiryDate}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={paymentForm.cvv}
                    onChange={handleInputChange}
                    className={`w-full border ${formErrors.cvv ? "border-red-500" : "border-gray-300"} px-4 py-2 rounded-lg`}
                    placeholder="123"
                    maxLength={4}
                  />
                  {formErrors.cvv && <p className="text-red-600 text-sm">{formErrors.cvv}</p>}
                </div>
              </div>

              <div className="text-center pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white py-3 px-12 rounded-lg font-semibold transition"
                >
                  {loading ? "PROCESSING..." : `PAY $${payData.total.toFixed(2)}`}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
