import React, { useEffect, useState } from "react";
import WarehouseLayout from "../../components/sidebar/warehouseLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaBoxes, FaCubes, FaTruckLoading, FaWarehouse } from "react-icons/fa";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const Inventory = () => {
  const navigate = useNavigate();

  const [rawMaterials, setRawMaterials] = useState([]);
  const [packingMaterials, setPackingMaterials] = useState([]);
  const [finalProducts, setFinalProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rawRes, packingRes, finalRes] = await Promise.all([
          axios.get("http://localhost:5000/api/rawMaterial"),
          axios.get("http://localhost:5000/api/packingMaterial"),
          axios.get("http://localhost:5000/api/finalProduct"),
        ]);

        setRawMaterials(rawRes.data);
        setPackingMaterials(packingRes.data);
        setFinalProducts(finalRes.data);
      } catch (error) {
        console.error("Error fetching inventory data:", error);
      }
    };

    fetchData();
  }, []);

  const warehouseSpace = [
    { name: "Stock Room 1", totalSpace: 5000 },
    { name: "Stock Room 2", totalSpace: 5500 },
    { name: "Stock Room 3", totalSpace: 7500 },
    { name: "Main Rack Zone", totalSpace: 10000 },
    { name: "Cold Room", totalSpace: 500 },
  ];

  const calculateOccupiedSpace = (materials, targetLocation) => {
    const normalizedTarget = normalizeLocationName(targetLocation);

    const occupied = materials
      .filter((item) => {
        const itemLocation = item.location ? normalizeLocationName(item.location) : "";
        return itemLocation === normalizedTarget;
      })
      .reduce((total, item) => total + (item.quantity || 0), 0);

    return occupied;
  };

  const normalizeLocationName = (name) => {
    switch (name.trim().toLowerCase()) {
      case "storage room 3":
        return "stock room 3";
      case "storage room 1":
        return "stock room 1";
      case "storage room 2":
        return "stock room 2";
      default:
        return name.trim().toLowerCase();
    }
  };

  const renderCategory = (title, items, icon, bgColor, textColor, navPath) => (
    <div className="w-full">
      <div className={`min-h-[400px] p-5 rounded-2xl transition hover:-translate-y-1 hover:shadow-2xl ${bgColor}`}>
        <h2 className={`flex items-center mb-4 text-xl font-bold ${textColor}`}>
          {icon} <span className="ml-2">{title}</span>
        </h2>
        <ul className="space-y-2">
          {items.slice(0, 5).map((item, index) => (
            <li key={index} className="flex justify-between p-3 bg-white rounded-lg shadow-sm">
              <span>{item.name}</span>
              <span className="text-sm font-semibold text-gray-700">{item.quantity} units</span>
            </li>
          ))}
        </ul>
        <button
          onClick={() => navigate(navPath)}
          className="px-4 py-2 mt-4 text-sm font-semibold text-white bg-gray-800 rounded hover:bg-gray-700"
        >
          View {title}
        </button>
      </div>
    </div>
  );

  const renderAvailableSpaceCard = () => (
    <div className="w-full">
      <div className="min-h-[400px] p-5 rounded-2xl transition hover:-translate-y-1 hover:shadow-2xl bg-emerald-300">
        <h2 className="flex items-center mb-4 text-xl font-bold text-emerald-900">
          <FaWarehouse className="mr-2" /> Available Space 
        </h2>
        <ul className="space-y-2">
          {warehouseSpace.map((space, index) => {
            const raw = calculateOccupiedSpace(rawMaterials, space.name);
            const pack = calculateOccupiedSpace(packingMaterials, space.name);
            const final = calculateOccupiedSpace(finalProducts, space.name);
            const occupied = raw + pack + final;
            const available = Math.max(0, space.totalSpace - occupied);
            return (
              <li key={index} className="flex justify-between p-3 bg-white rounded-lg shadow-sm">
                <span>{space.name}</span>
                <span className="text-sm font-semibold text-gray-700">{available} units</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );

  const generateColorArray = () => {
    const colors = ["#ff8042", "#82ca9d", "#8884d8", "#d32f2f", "#388e3c"];
    return colors;
  };

  return (
    <WarehouseLayout>


     <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Inventory Overview</h1>
      </div>

      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        
        {/* First Row: Raw Materials & Packing Materials */}
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="mb-3 font-semibold text-center">Raw Materials</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={rawMaterials} dataKey="quantity" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#82ca9d" label>
                {rawMaterials.map((_, index) => <Cell key={index} fill={generateColorArray()[index % 5]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="mb-3 font-semibold text-center">Packing Materials</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={packingMaterials} dataKey="quantity" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#ff8042" label>
                {packingMaterials.map((_, index) => <Cell key={index} fill={generateColorArray()[index % 5]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Second Row: Final Products & Warehouse Space Usage */}
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="mb-3 font-semibold text-center">Final Products</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={finalProducts} dataKey="quantity" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                {finalProducts.map((_, index) => <Cell key={index} fill={generateColorArray()[index % 5]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Warehouse Space Usage Chart */}
<div className="p-4 bg-white rounded-lg shadow">
  <h3 className="mb-3 font-semibold text-center">Warehouse Space Usage</h3>
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      {(() => {
        const totalSpace = warehouseSpace.reduce((acc, curr) => acc + curr.totalSpace, 0);
        let usedSpace = 0;

        warehouseSpace.forEach((space) => {
          const raw = calculateOccupiedSpace(rawMaterials, space.name);
          const pack = calculateOccupiedSpace(packingMaterials, space.name);
          const final = calculateOccupiedSpace(finalProducts, space.name);
          usedSpace += raw + pack + final;
        });

        const availableSpace = Math.max(0, totalSpace - usedSpace);
        const data = [
          { name: 'Used Space', value: usedSpace },
          { name: 'Available Space', value: availableSpace },
        ];

        return (
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#ff8c00" label>
            <Cell key="used" fill="#d32f2f" />
            <Cell key="available" fill="#388e3c" />
          </Pie>
        );
      })()}
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
</div>


      </div>

      <div className="flex items-center justify-between mt-10 mb-6">
        <h1 className="text-2xl font-bold">Summary Cards</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 mt-10 sm:grid-cols-2 lg:grid-cols-4">
        {renderCategory("Raw Materials", rawMaterials, <FaTruckLoading />, "bg-purple-300", "text-purple-900", "/inventory/rawMaterialList")}
        {renderCategory("Packing Materials", packingMaterials, <FaBoxes />, "bg-sky-300", "text-sky-900", "/inventory/packingMaterialList")}
        {renderCategory("Final Products", finalProducts, <FaCubes />, "bg-rose-300", "text-rose-900", "/inventory/finalProductList")}
        {renderAvailableSpaceCard()}
      </div>

    </WarehouseLayout>
  );
};

export default Inventory;
