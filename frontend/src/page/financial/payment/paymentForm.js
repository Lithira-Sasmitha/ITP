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
  console.log(payData);

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
    <div className="relative z-10 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8" style={{ color: "#5e5a36" }}>
        Payment
      </h1>

      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 py-10">

        {/* Booking Summary */}
        <div className="mb-8 border border-gray-300 rounded-lg p-6 w-full" style={{ backgroundColor: "#fffded" }}>
          <h2 className="text-xl font-bold mb-4" style={{ color: "#5e5a36" }}>Booking Summary</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">Booking ID</p>
              <p className="font-medium">{payData.order_id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium">{payData.fullName}</p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600">Product Details</p>
            <ul className="list-disc list-inside">
              {payData.selectedproduct_type.map((facility, index) => (
                <li key={index} className="flex justify-between">
                  <span>{facility.title}</span>
                  <span>${facility.price.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-between items-center border-t border-gray-300 pt-4 font-bold">
            <span>Total</span>
            <span>${payData.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Card Payment Section */}
        <div className="border border-gray-300 rounded-lg p-6 w-full" style={{ backgroundColor: "#fffded" }}>
          <h2 className="text-xl font-bold mb-4" style={{ color: "#5e5a36" }}>Card Details</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            {/* Card Number */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#5e5a36" }}>Card Number</label>
              <input
                type="text"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={paymentForm.cardNumber}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 rounded border ${formErrors.cardNumber ? 'border-red-500' : 'border-gray-300'}`}
                maxLength={19}
              />
              {formErrors.cardNumber && <p className="mt-1 text-sm text-red-600">{formErrors.cardNumber}</p>}
            </div>

            {/* Card Name */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#5e5a36" }}>Name on Card</label>
              <input
                type="text"
                name="cardName"
                placeholder="John Doe"
                value={paymentForm.cardName}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 rounded border ${formErrors.cardName ? 'border-red-500' : 'border-gray-300'}`}
              />
              {formErrors.cardName && <p className="mt-1 text-sm text-red-600">{formErrors.cardName}</p>}
            </div>

            {/* Expiry and CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "#5e5a36" }}>Expiry Date</label>
                <input
                  type="text"
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={paymentForm.expiryDate}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded border ${formErrors.expiryDate ? 'border-red-500' : 'border-gray-300'}`}
                  maxLength={5}
                />
                {formErrors.expiryDate && <p className="mt-1 text-sm text-red-600">{formErrors.expiryDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "#5e5a36" }}>CVV</label>
                <input
                  type="text"
                  name="cvv"
                  placeholder="123"
                  value={paymentForm.cvv}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded border ${formErrors.cvv ? 'border-red-500' : 'border-gray-300'}`}
                  maxLength={4}
                />
                {formErrors.cvv && <p className="mt-1 text-sm text-red-600">{formErrors.cvv}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 text-center">
              <button
                type="submit"
                className="py-3 px-12 rounded text-white font-bold text-lg"
                style={{ backgroundColor: "#5e5a36" }}
                disabled={loading}
              >
                {loading ? "PROCESSING..." : `PAY $${payData.total.toFixed(2)}`}
              </button>
            </div>

            <div className="text-center text-sm text-gray-600">
              <p>This is a demo payment page. No actual payment will be processed.</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
