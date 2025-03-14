import React from "react";

const DeliveryDetail = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6">
        <h1 className="text-3xl mb-4">Delivery Management</h1>
        <input
          type="text"
          className="w-full p-2 border rounded mb-4"
          placeholder="Search Deliveries by Delivery No"
        />
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2 border">Delivery No</th>
              <th className="p-2 border">Order No</th>
              <th className="p-2 border">Delivery Item</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Contact No</th>
              <th className="p-2 border">Delivery Address</th>
              <th className="p-2 border">Order Date</th>
              <th className="p-2 border">Items Price</th>
              <th className="p-2 border">Delivery Price</th>
              <th className="p-2 border">Total Price</th>
            </tr>
          </thead>
          <tbody>
            {/* Example row - Repeat this for each delivery 
            <tr className="bg-green-100">
              <td className="p-2 border">DEL24101386</td>
              <td className="p-2 border">ORDER-1728820757170</td>
              <td className="p-2 border">Dell Inspiron 15 Laptop x 1</td>
              <td className="p-2 border">Vidumini</td>
              <td className="p-2 border">0703190639</td>
              <td className="p-2 border">NO.12/B, Gampaha, Western, 11000</td>
              <td className="p-2 border">10/13/2024</td>
              <td className="p-2 border">LKR 120,900.00</td>
              <td className="p-2 border">LKR 500.00</td>
              <td className="p-2 border">LKR 121,400.00</td>
            </tr>
            */}
            {/* Add more rows as needed */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeliveryDetail;
