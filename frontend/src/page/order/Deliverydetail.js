import React, { useState } from "react";

const DeliveryDetail = () => {
  const [search, setSearch] = useState("");
  const [deliveries, setDeliveries] = useState([
    {
      deliveryNo: "DEL24101386",
      orderNo: "ORDER-1728820757170",
      customerName: "Vidumini",
      address: "NO.12/B, Gampaha, Western, 11000",
      postalCode: "11000",
      telephone: "0703190639",
      quantity: 1,
      oneItemPrice: "LKR 120,900.00",
      itemsPrice: "LKR 120,900.00",
      deliveryPrice: "LKR 500.00",
      totalPrice: "LKR 121,400.00",
      orderDate: "10/13/2024",
      orderStatus: "", // New order status added
      deliveryStatus: "", // Updated to deliveryStatus
      confirmOrderDate: "",
    },
    // Add more deliveries as needed
  ]);

  const handleStatusChange = (deliveryNo, status) => {
    setDeliveries(
      deliveries.map((delivery) =>
        delivery.deliveryNo === deliveryNo
          ? { ...delivery, deliveryStatus: status } // Updated to deliveryStatus
          : delivery
      )
    );
  };

  const handleDelete = (deliveryNo) => {
    setDeliveries(
      deliveries.filter((delivery) => delivery.deliveryNo !== deliveryNo)
    );
  };

  const filteredDeliveries = deliveries.filter(
    (delivery) => delivery.orderNo.toLowerCase().includes(search.toLowerCase()) // Search by orderNo
  );

  const getRowColor = (deliveryStatus) => {
    if (deliveryStatus === "Pending") return "bg-yellow-200";
    if (deliveryStatus === "Delayed") return "bg-blue-200";
    if (deliveryStatus === "Completed") return "bg-green-200";
    return "";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl mb-4 font-semibold">Delivery Management</h1>
      <input
        type="text"
        className="w-full p-2 border rounded mb-4"
        placeholder="Search Deliveries by Order ID"
        value={search}
        onChange={(e) => setSearch(e.target.value)} // Update search value
      />
      <div className="overflow-x-auto">
        <table className="w-full border-collapse shadow-lg bg-white">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="p-3 border">Order ID</th>
              <th className="p-3 border">Confirm Order Date</th>
              <th className="p-3 border">Customer Name</th>
              <th className="p-3 border">Address</th>
              <th className="p-3 border">Postal Code</th>
              <th className="p-3 border">Telephone</th>
              <th className="p-3 border">Quantity</th>
              <th className="p-3 border">One Item Price</th>
              <th className="p-3 border">Items Price</th>
              <th className="p-3 border">Delivery Price</th>
              <th className="p-3 border">Total Price</th>
              <th className="p-3 border">Order Date</th>
              <th className="p-3 border">Order Status</th>{" "}
              {/* New Order Status column */}
              <th className="p-3 border">Delivery Status</th>{" "}
              {/* Delivery Status column */}
              <th className="p-3 border">Actions</th> {/* Actions column */}
            </tr>
          </thead>
          <tbody>
            {filteredDeliveries.length > 0 ? (
              filteredDeliveries.map((delivery, index) => (
                <tr
                  key={index}
                  className={`odd:bg-gray-100 even:bg-gray-200 ${getRowColor(
                    delivery.deliveryStatus
                  )}`}
                >
                  <td className="p-3 border">{delivery.orderNo}</td>
                  <td className="p-3 border">{delivery.confirmOrderDate}</td>
                  <td className="p-3 border">{delivery.customerName}</td>
                  <td className="p-3 border">{delivery.address}</td>
                  <td className="p-3 border">{delivery.postalCode}</td>
                  <td className="p-3 border">{delivery.telephone}</td>
                  <td className="p-3 border">{delivery.quantity}</td>
                  <td className="p-3 border">{delivery.oneItemPrice}</td>
                  <td className="p-3 border">{delivery.itemsPrice}</td>
                  <td className="p-3 border">{delivery.deliveryPrice}</td>
                  <td className="p-3 border">{delivery.totalPrice}</td>
                  <td className="p-3 border">{delivery.orderDate}</td>
                  <td className="p-3 border">
                    {delivery.orderStatus || "Not Assigned"}
                  </td>{" "}
                  {/* New Order Status field */}
                  <td className="p-3 border">
                    {delivery.deliveryStatus || "Not Assigned"}
                  </td>
                  <td className="p-3 border">
                    <button
                      onClick={() =>
                        handleStatusChange(delivery.deliveryNo, "Pending")
                      }
                      className="bg-yellow-400 text-white px-3 py-1 rounded-md mr-2"
                    >
                      Pending
                    </button>
                    <button
                      onClick={() =>
                        handleStatusChange(delivery.deliveryNo, "Delayed")
                      }
                      className="bg-blue-400 text-white px-3 py-1 rounded-md mr-2"
                    >
                      Delayed
                    </button>
                    <button
                      onClick={() =>
                        handleStatusChange(delivery.deliveryNo, "Completed")
                      }
                      className="bg-green-400 text-white px-3 py-1 rounded-md mr-2"
                    >
                      Completed
                    </button>
                    <button
                      onClick={() => handleDelete(delivery.deliveryNo)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="14" className="p-3 border text-center">
                  No deliveries found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeliveryDetail;
