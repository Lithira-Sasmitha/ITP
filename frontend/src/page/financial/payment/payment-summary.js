import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const PaymentSummary = () => {
  const location = useLocation();
  const [payData, setPayData] = useState(location.state);

  useEffect(() => {
    // If payData is not available, try to retrieve it from localStorage
    if (!payData) {
      const storedData = localStorage.getItem("paymentData");
      if (storedData) {
        setPayData(JSON.parse(storedData));
      }
    } else {
      // Save payData to localStorage for persistence
      localStorage.setItem("paymentData", JSON.stringify(payData));
    }
  }, [payData]);

  if (!payData) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-red-600">No booking data found.</h2>
      </div>
    );
  }

  const handleGetQR = () => {
    alert("QR generation not implemented yet.");
  };

  const handleDownloadSummary = () => {
    generatePDF();
  };

  const handleTrackOrder = () => {
    alert("Track Order feature not implemented yet.");
  };

  // Function to generate and download PDF
  const generatePDF = () => {
    // Create a new PDF document
    const doc = new jsPDF();
    
    // Set document properties
    doc.setProperties({
      title: `Payment Receipt - ${payData.order_id}`,
      subject: 'Payment Summary',
      author: 'Your Company Name',
      keywords: 'payment, receipt, invoice',
      creator: 'Your Company Name'
    });
    
    // Add logo (replace with your actual logo path)
    // doc.addImage('/assets/images/logo.png', 'PNG', 15, 10, 30, 30);
    
    // Add title
    doc.setFontSize(22);
    doc.setTextColor(94, 90, 54); // #5e5a36
    doc.text('Payment Receipt', 105, 20, { align: 'center' });
    
    // Add decorative line
    doc.setDrawColor(94, 90, 54); // #5e5a36
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);
    
    // Add company info
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Your Company Name', 20, 35);
    doc.text('123 Business Avenue', 20, 40);
    doc.text('City, State 12345', 20, 45);
    doc.text('Phone: (123) 456-7890', 20, 50);
    doc.text('Email: support@yourcompany.com', 20, 55);
    
    // Add receipt info
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 140, 35);
    doc.text(`Receipt #: ${payData.order_id}`, 140, 40);
    doc.text(`Status: PAID`, 140, 45);

    // Add customer info
    doc.setFontSize(12);
    doc.setTextColor(94, 90, 54); // #5e5a36
    doc.text('Customer Information', 20, 70);
    
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    doc.line(20, 72, 190, 72);
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Name: ${payData.fullName}`, 20, 80);
    
    // Product table
    doc.setFontSize(12);
    doc.setTextColor(94, 90, 54); // #5e5a36
    doc.text('Order Details', 20, 95);
    
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    doc.line(20, 97, 190, 97);
    
    // Create table for products
    const tableColumn = ["Item", "Price"];
    const tableRows = [];
    
    // Add product data to table
    if (payData.product_type && Array.isArray(payData.product_type)) {
      payData.product_type.forEach(item => {
        const itemData = [
          item.title,
          `$${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}`
        ];
        tableRows.push(itemData);
      });
    }
    
    // Add the table
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 105,
      theme: 'plain',
      styles: { 
        fontSize: 10,
        cellPadding: 6,
      },
      headStyles: {
        fillColor: [240, 240, 220],
        textColor: [94, 90, 54],
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { cellWidth: 130 },
        1: { cellWidth: 40, halign: 'right' },
      },
    });
    
    // Get the y position after the table
    let finalY = 150;
    
    // Safe way to get the final Y position from the table
    try {
      if (doc.previousAutoTable && doc.previousAutoTable.finalY) {
        finalY = doc.previousAutoTable.finalY + 10;
      } else if (doc.lastAutoTable && doc.lastAutoTable.finalY) {
        finalY = doc.lastAutoTable.finalY + 10;
      }
    } catch (e) {
      console.log("Using default Y position:", e);
    }
    
    // Add total
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Total:', 150, finalY);
    doc.text(`$${typeof payData.total === 'number' ? payData.total.toFixed(2) : payData.total}`, 190, finalY, { align: 'right' });
    
    // Add footer
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Thank you for your business!', 105, finalY + 20, { align: 'center' });
    
    // Add QR code placeholder text
    doc.setFontSize(8);
    doc.text('Scan QR code to verify receipt', 105, finalY + 30, { align: 'center' });
    
    // Add decorative border
    doc.setDrawColor(94, 90, 54); // #5e5a36
    doc.setLineWidth(0.5);
    doc.rect(5, 5, 200, 287);
    
    // Save the PDF
    doc.save(`Receipt-${payData.order_id}.pdf`);
  };

  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: "#CDE7C5FF" }}>
      <main className="flex-grow w-full py-10 px-4 relative">
        <div
          className="absolute inset-0 bg-contain bg-center pointer-events-none opacity-20"
          style={{
            backgroundImage: "url('/assets/images/mandala-pattern.png')",
            backgroundRepeat: "no-repeat",
            zIndex: 0,
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-10" style={{ color: "#5e5a36" }}>
            Payment Summary
          </h1>

          <div
            className="border border-gray-800 rounded-lg p-10 mb-10"
            style={{ backgroundColor: "#fffded" }}
          >
            <div className="space-y-6">
              <div className="flex">
                <span className="w-32 font-semibold" style={{ color: "#5e5a36" }}>Order ID</span>
                <span className="mx-2">:</span>
                <span>{payData.order_id}</span>
              </div>

              <div className="flex">
                <span className="w-32 font-semibold" style={{ color: "#5e5a36" }}>Name</span>
                <span className="mx-2">:</span>
                <span>{payData.fullName}</span>
              </div>

              <div className="flex flex-start align-top">
                <span className="w-32 font-semibold" style={{ color: "#5e5a36" }}>Product</span>
                <span className="mx-2">:</span>
                <div className="flex flex-col">
                  {payData.product_type?.map((facility, index) => (
                    <div key={index} className="flex justify-between w-full">
                      <span>{facility.title}</span>
                      <span className="ml-4">${facility.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex pt-4 border-t border-gray-300">
                <span className="w-32 font-semibold" style={{ color: "#5e5a36" }}>Total</span>
                <span className="mx-2">:</span>
                <span className="font-bold">
                  ${typeof payData.total === 'number' ? payData.total.toFixed(2) : payData.total}
                </span>
              </div>

              <div className="flex">
                <span className="w-32 font-semibold" style={{ color: "#5e5a36" }}>Status</span>
                <span className="mx-2">:</span>
                <span className="text-green-600 font-medium">Paid</span>
              </div>
            </div>
          </div>

          {/* Aligned Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleGetQR}
              className="w-full sm:w-60 py-3 rounded text-white font-medium"
              style={{ backgroundColor: "#5e5a36" }}
            >
              Get QR
            </button>

            <button
              onClick={handleDownloadSummary}
              className="w-full sm:w-60 py-3 rounded text-white font-medium"
              style={{ backgroundColor: "#5e5a36" }}
            >
              Download Summary
            </button>

            <button
              onClick={handleTrackOrder}
              className="w-full sm:w-60 py-3 rounded text-white font-medium"
              style={{ backgroundColor: "#5e5a36" }}
            >
              Track Order
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentSummary;