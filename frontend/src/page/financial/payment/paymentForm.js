import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const PaymentForm = () => {
  const location = useLocation();
  const { total = 0, deliveryPrice = 0 } = location.state || {};

  const [form, setForm] = useState({
    ownerName: "",
    accountNumber: "",
    bank: "",
    password: "",
    expiry: "",
    cvd: "",
  });

  const [showCvd, setShowCvd] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  const expiryDate = new Date("2025-04-30");

  useEffect(() => {
    const now = new Date();
    if (now > expiryDate) {
      setIsExpired(true);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isExpired) return;

    // Do real payment processing here
    console.log("Payment submitted:", {
      ...form,
      totalAmount: total,
      deliveryCharge: deliveryPrice,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-6 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Payment Form
        </h2>

        <div className="mb-4 text-center">
          <p className="text-lg font-semibold text-gray-800">
            Total Bill: <span className="text-blue-600">${total.toFixed(2)}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Bank</label>
            <input
              type="text"
              name="bank"
              value={form.bank}
              onChange={handleChange}
              className="w-full p-2 border rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Owner's Account Name</label>
            <input
              type="text"
              name="ownerName"
              value={form.ownerName}
              onChange={handleChange}
              className="w-full p-2 border rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Account Number</label>
            <input
              type="text"
              name="accountNumber"
              value={form.accountNumber}
              onChange={handleChange}
              className="w-full p-2 border rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
              <input
                type="month"
                name="expiry"
                value={form.expiry}
                onChange={handleChange}
                className="w-full p-2 border rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">CVD</label>
              <div className="relative">
                <input
                  type={showCvd ? "text" : "password"}
                  name="cvd"
                  value={form.cvd}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-xl mt-1 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <span
                  onClick={() => setShowCvd(!showCvd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                >
                  {showCvd ? "🙈" : "👁️"}
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-3 font-semibold text-white rounded-xl transition ${
              isExpired ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={isExpired}
          >
            {isExpired ? "Form Expired" : "Submit Payment"}
          </button>

          <p className="text-xs text-center text-gray-500 mt-2">
            This form will expire on{" "}
            <span className="font-medium">{expiryDate.toDateString()}</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
