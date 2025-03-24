import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import Dashboard from './page/inventory/dashboard';
import InventoryPage from './page/inventory/inventoryPage';
import RawMaterialList from './page/inventory/rawMaterialList';
import AddRawMaterial from './page/inventory/addRawMaterial';
import UpdateRawMaterial from './page/inventory/updateRawMaterial';
import PackingMaterialList from './page/inventory/packingMaterialList';
import AddPackingMaterial from './page/inventory/addPackingMaterial';
import UpdatePackingMaterial from './page/inventory/updatePackingMaterial';
import FinalProductList from './page/inventory/finalProductList';
import AddFinalProduct from './page/inventory/addFinalProduct';
import UpdateFinalProduct from './page/inventory/updateFinalProduct';
import FinalProductQR from './page/inventory/finalProductQR';
import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./page/financial/dashboard";
import Sidebar from "./components/sidebar/sidebar";

// Financial Management Pages
import Income from "./page/financial/income";
import Expense from "./page/financial/expense";
import Salary from "./page/financial/salary";
import Payment from "./page/financial/payment";
import Message from "./page/financial/message";
import { FiMenu } from "react-icons/fi"; // Import menu icon

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
    <Router>
      <Routes>
        <Route path="/inventory/dashboard" element={<Dashboard />} />
        <Route path="/inventory/addFinalProduct" element={<AddFinalProduct />} />
        <Route path="/inventory/inventoryPage" element={<InventoryPage />} />
        <Route path="/inventory/rawMaterialList" element={<RawMaterialList />} />
        <Route path="/inventory/addRawMaterial" element={<AddRawMaterial />} />
        <Route path="/inventory/packingMaterialList" element={<PackingMaterialList />} />
        <Route path="/inventory/addPackingMaterial" element={<AddPackingMaterial />} />
        <Route path="/inventory/finalProductList" element={<FinalProductList />} />
        <Route path="/inventory/updateRawMaterial/:id" element={<UpdateRawMaterial />} />
        <Route path="/inventory/updatePackingMaterial/:id" element={<UpdatePackingMaterial />} />
        <Route path="/inventory/updateFinalProduct/:id" element={<UpdateFinalProduct />} />
        <Route path="/inventory/finalProductQR" element={<FinalProductQR />} />
      </Routes>
    </Router><div className="flex h-screen bg-white-100 text-gray-100 overflow-hidden">
        {/* Background Effects */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from white-100 via-gray-800 to-gray-900 opacity-80" />
          <div className="absolute inset-0 backdrop-blur-sm" />
        </div>

        <Router>
          <div className="flex w-full h-screen relative">
            {/* Mobile Toggle Button */}
            <button
              className="absolute top-4 left-4 md:hidden z-50 p-2 bg-gray-700 rounded-md"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <FiMenu className="text-white text-2xl" />
            </button>

            {/* Sidebar */}
            <div
              className={`fixed inset-y-0 left-0 w-64 bg-gray-800 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative transition-transform duration-300 ease-in-out z-40`}
            >
              <Sidebar />
            </div>

            <div className="flex-grow p-4 w-full md:w-auto overflow-auto transition-all">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/income" element={<Income />} />
                <Route path="/expense" element={<Expense />} />
                <Route path="/salary" element={<Salary />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/message" element={<Message />} />
              </Routes>
            </div>
          </div>
        </Router>
      </div>
      </>
  );
}

export default App;
