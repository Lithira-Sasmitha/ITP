import "./App.css";
 
import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./page/machine/redux/store"; // Import the Redux store (adjust path as needed)
import Layout from "./page/machine/Layout";
import Prodetails from "./page/machine/Prodetails";
import AddMachine from "./page/machine/AddMachine";
import AddMachineParts from "./page/machine/AddMachineParts";
import MachineDashboard from "./page/machine/MachineDashboard";
import MachineMaintenance from "./page/machine/MachineMaintenance";
import Product from "./page/machine/Product";


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
    <><Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/dashboard" element={<MachineDashboard />} />
            <Route path="/add-machine" element={<AddMachine />} />
            <Route path="/product-details" element={<Prodetails />} />
            <Route path="/machine-parts" element={<AddMachineParts />} />
            <Route path="/maintenance" element={<MachineMaintenance />} />
            <Route path="/product" element={<Product />} />



          </Route>
        </Routes>
      </Router>
    </Provider><div className="flex h-screen bg-white-100 text-gray-100 overflow-hidden">
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

            {/* Main Content */}
            <div className="flex-grow p-4 w-full md:w-auto overflow-auto transition-all">
              <Routes>
                <Route path="/financialdashboard" element={<Dashboard />} />
                <Route path="/income" element={<Income />} />
                <Route path="/expense" element={<Expense />} />
                <Route path="/salary" element={<Salary />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/message" element={<Message />} />
              </Routes>
            </div>
          </div>
        </Router>
      </div></>
  );
}

export default App;