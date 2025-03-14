import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaChartBar, FaWarehouse, FaCubes, FaBarcode, FaEnvelope } from "react-icons/fa";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import logo from "../../assets/logo.png";

function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="flex flex-col justify-between w-64 p-5 text-white bg-green-900 shadow-lg">
        <div>
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Logo" className="w-16 h-16 rounded-full" />
          </div>
          <nav>
            <ul>
              <li className="mb-4">
                <button onClick={() => navigate("/dashboard")} className="flex items-center w-full p-3 bg-red-600 rounded-lg hover:bg-red-500">
                  <FaChartBar className="mr-4" /> Dashboard
                </button>
              </li>
              <li className="mb-4">
                <button onClick={() => navigate("/inventory")} className="flex items-center w-full p-3 rounded-lg hover:bg-green-700">
                  <FaWarehouse className="mr-4" /> Inventory
                </button>
              </li>
              <li className="mb-4">
                <button onClick={() => navigate("/stock-movement")} className="flex items-center w-full p-3 rounded-lg hover:bg-green-700">
                  <FaCubes className="mr-4" /> Stock Movements
                </button>
              </li>
              <li className="mb-4">
                <button onClick={() => navigate("/qr-generator")} className="flex items-center w-full p-3 rounded-lg hover:bg-green-700">
                  <FaBarcode className="mr-4" /> QR Generator
                </button>
              </li>
            </ul>
          </nav>
        </div>
        <div className="text-sm text-gray-300">
          <div className="flex items-center mb-2">
            <FaEnvelope className="mr-2" /> warehouse@ceyloncoir.com
          </div>
          <div>{currentTime.toLocaleTimeString()}</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-8 overflow-y-auto">
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
            <li className="p-3 mb-2 bg-gray-100 rounded-lg">Checked Raw Material Stock - 1 Hour</li>
            <li className="p-3 mb-2 bg-gray-100 rounded-lg">Updated Packing Material Usage - 1 Hour</li>
            <li className="p-3 mb-2 bg-gray-100 rounded-lg">QR Code Generated for Final Product - 1 Hour</li>
            <li className="p-3 mb-2 bg-gray-100 rounded-lg">Stock Movement Recorded - 1 Hour</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
