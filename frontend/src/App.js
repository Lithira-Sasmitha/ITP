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
import { FiMenu } from "react-icons/fi"; 

// import Layout from "./page/order/Layout";

import Delivery from "./page/order/Delivery";
import DeliveryDetail from "./page/order/Deliverydetail";
import AddDelivery from "./page/order/AddDelivery";
import DrivervehicleDetails from "./page/order/DrivervehicleDetails";
import Settings from "./page/order/Settings";
import Logout from "./page/order/Logout";
import DeliverAdminProfile from "./page/order/DeliverAdminProfile";
import DeliverHome from "./page/order/DeliverHome";

import PlaceOrder from "./page/order/PlaceOrder";
import Orderhistorys from "./page/order/Orderhistorys";
import OrderConfirmation from "./page/order/OrderConfirmation";
import OrderTracking from "./page/order/OrderTracking"; // Import the new component

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <><><Provider store={store}>
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
        <Router>

          
            <Routes>
              <Route path="/financialdashboard" element={<Dashboard />} />
              <Route path="/income" element={<Income />} />
              <Route path="/expense" element={<Expense />} />
              <Route path="/salary" element={<Salary />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/message" element={<Message />} />
            </Routes>
          

        </Router>
      </><Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<DeliverHome />} />
            <Route path="/dashboard" element={<Delivery />} />
            <Route path="deliverydetail" element={<DeliveryDetail />} />
            <Route path="adddelivery" element={<AddDelivery />} />
            <Route path="profile" element={<DeliverAdminProfile />} />
            <Route
              path="drivervehicledetails"
              element={<DrivervehicleDetails />} />
            <Route path="pendingorders" element={<Orderhistorys />} />
            <Route path="settings" element={<Settings />} />
            <Route path="logout" element={<Logout />} />

            {/* Route to handle place order */}
            <Route path="placeorder" element={<PlaceOrder />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            {/* New route for order tracking */}
            <Route path="/orders/track" element={<OrderTracking />} />
            <Route path="adddelivery/:orderId" element={<AddDelivery />} />
          </Route>
        </Routes>
      </Router></>
  );
}

export default App;