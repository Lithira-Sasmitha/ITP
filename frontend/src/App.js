import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import Dashboard from './page/inventory/dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/inventory/dashboard" element={<Dashboard />} />
        {/* You can add more routes here */}
      </Routes>
    </Router>
  );
}

export default App;
