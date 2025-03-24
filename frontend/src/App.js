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
    </Provider>
    <div className="flex h-screen bg-white-100 text-gray-100 overflow-hidden">
        {/* Background Effects */}

        <Router>

            {/* Mobile Toggle Button */}


            {/* Main Content */}
            <div >
              <Routes>
                <Route path="/financialdashboard" element={<Dashboard />} />
                <Route path="/income" element={<Income />} />
                <Route path="/expense" element={<Expense />} />
                <Route path="/salary" element={<Salary />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/message" element={<Message />} />
              </Routes>
            </div>
          
        </Router>
      </div></>
  );
}

export default App;