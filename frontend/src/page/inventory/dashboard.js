// src/pages/Dashboard.js

import React from "react";
import WarehouseLayout from "../../components/sidebar/warehouseLayout";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c"];

  const rawMaterialsData = [
    { name: "Coconut Husk", value: 400 },
    { name: "Coir Fiber", value: 300 },
    { name: "Dust", value: 300 },
  ];

  const packingMaterialsData = [
    { name: "Bags", value: 200 },
    { name: "Straps", value: 150 },
    { name: "Pallets", value: 100 },
  ];

  const finalProductsData = [
    { name: "Coco Peat Blocks", value: 250 },
    { name: "Grow Bags", value: 180 },
    { name: "Coir Bricks", value: 120 },
  ];

  const warehouseSpaceData = [
    { name: "Used Space", value: 75 },
    { name: "Available Space", value: 25 },
  ];

  const renderPieChart = (data, title) => (
    <div className="w-full p-4 md:w-1/2 xl:w-1/4">
      <div className="p-4 bg-white shadow rounded-2xl">
        <h3 className="mb-2 text-xl font-semibold text-center">{title}</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <WarehouseLayout>
      <h1 className="mb-6 text-2xl font-bold">Inventory Dashboard</h1>

      {/* Charts */}
      <div className="flex flex-wrap justify-center mb-8 -mx-4">
        {renderPieChart(rawMaterialsData, "Raw Materials")}
        {renderPieChart(packingMaterialsData, "Packing Materials")}
        {renderPieChart(finalProductsData, "Final Products")}
        {renderPieChart(warehouseSpaceData, "Warehouse Space")}
      </div>

      {/* Staff Time Log */}
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">Staff Activity Log</h2>
        <ul>
          <li className="p-3 mb-2 bg-gray-100 rounded-lg">
            Checked Raw Material Stock - 1 Hour
          </li>
          <li className="p-3 mb-2 bg-gray-100 rounded-lg">
            Updated Packing Material Usage - 1 Hour
          </li>
          <li className="p-3 mb-2 bg-gray-100 rounded-lg">
            QR Code Generated for Final Product - 1 Hour
          </li>
          <li className="p-3 mb-2 bg-gray-100 rounded-lg">
            Stock Movement Recorded - 1 Hour
          </li>
        </ul>
      </div>
    </WarehouseLayout>
  );
};

export default Dashboard;
