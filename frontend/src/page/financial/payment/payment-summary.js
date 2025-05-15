import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { QRCodeSVG } from "qrcode.react";

const PaymentSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialData = location.state;
  const [payData, setPayData] = useState(initialData);
  const [showQR, setShowQR] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState("");
  
  // Generate a unique receipt URL that contains the order ID
  useEffect(() => {
    if (payData && payData.order_id) {
      // Create a URL that points to your receipt page with the order ID as a parameter
      // You can adjust this based on your domain and routing structure
      const baseUrl = window.location.origin; // Gets the base URL of your application
      const receiptLink = `${baseUrl}/receipt/${payData.order_id}`;
      setReceiptUrl(receiptLink);
    }
  }, [payData]);

  useEffect(() => {
    if (!initialData) {
      const storedData = localStorage.getItem("paymentData");
      if (storedData) {
        setPayData(JSON.parse(storedData));
      }
    } else {
      localStorage.setItem("paymentData", JSON.stringify(initialData));
    }
  }, [initialData]);

  if (!payData) {
    return (
      <div className="min-h-screen bg-green-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">Payment summary not found.</p>
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

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.setTextColor(94, 90, 54);
    doc.text('Payment Receipt', 105, 20, { align: 'center' });

    autoTable(doc, {
      head: [["Item", "Price"]],
      body: payData.product_type?.map(item => [
        item.title,
        `${parseFloat(item.price || 0).toFixed(2)}`
      ]) || [],
      startY: 40,
      theme: 'grid',
    });

    doc.text(`Total: ${parseFloat(payData.total || 0).toFixed(2)}`, 20, doc.lastAutoTable.finalY + 10);
    doc.save(`Receipt-${payData.order_id}.pdf`);
  };
  
  const toggleQR = () => {
    setShowQR(!showQR);
  };

  return (
    <div className="min-h-screen bg-green-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-green-600 px-6 py-4 text-center">
          <h2 className="text-3xl font-extrabold text-white">Payment Summary</h2>
        </div>

        <div className="px-6 py-8">
          <SummaryRow label="Order ID" value={payData.order_id} />
          <SummaryRow label="Name" value={payData.fullName} />

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Products</h3>
            <div className="space-y-2">
              {payData.product_type?.map((product, index) => (
                <div key={index} className="flex justify-between py-2 px-4 bg-gray-50 rounded-lg">
                  <span>{product.title}</span>
                  <span>${parseFloat(product.price || 0).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between mt-6 border-t pt-4 text-lg font-semibold">
            <span>Total</span>
            <span className="text-green-700">${parseFloat(payData.total || 0).toFixed(2)}</span>
          </div>

          <div className="flex justify-between mt-2 text-gray-600">
            <span>Status</span>
            <span className="text-green-600 font-medium">Paid</span>
          </div>

          {showQR && receiptUrl && (
            <div className="mt-8 flex flex-col items-center">
              <div className="bg-white p-4 rounded-lg shadow">
                <QRCodeSVG value={receiptUrl} size={200} level={"M"} />
              </div>
              <p className="mt-2 text-sm text-gray-500">Scan to view receipt details</p>
            </div>
          )}

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <ActionButton text={showQR ? "Hide QR" : "Show Receipt QR"} onClick={toggleQR} />
            <ActionButton text="Download Summary" onClick={generatePDF} />
            <ActionButton text="Track Order" onClick={() => {
              if (payData.order_id) {
                navigate("/orders/track", { state: { orderId: payData.order_id } });
              }
            }} />
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryRow = ({ label, value }) => (
  <div className="mb-4">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium text-gray-800">{value}</p>
  </div>
);

const ActionButton = ({ text, onClick }) => (
  <button
    onClick={onClick}
    className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition w-full sm:w-auto"
  >
    {text}
  </button>
);

export default PaymentSummary;