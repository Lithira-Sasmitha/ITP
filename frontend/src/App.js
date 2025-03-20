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
import StockMovements from './page/inventory/stockMovements';

function App() {
  return (
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
        <Route path="/inventory/stockMovements" element={<StockMovements />} />
      </Routes>
    </Router>
  );
}

export default App;
