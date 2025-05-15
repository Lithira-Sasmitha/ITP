
import './App.css';
import { useState } from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import StockMovement from './page/inventory/stockMovement';

import SignIn from "./components/login/index.jsx"; 
import Signup from "./components/register/index.js";
import Home from "./components/home/index.js";
import Allusers from "./page/emplyee/Allusers.js";
import Userupdate from "./page/emplyee/Userupdate.js"
import Requestedleave from "./page/emplyee/Requestedleave.js";
import Approveleave from "./page/emplyee/Approveleave.js";
import Employeedashboard from './page/emplyee/employee_Dashboard.js';
import Employeeprofiledashboard from './page/emplyee/employeeProfileDashboard.js';
import Employeeattendance from './page/emplyee/employeeAttendance.js';
import Edidemployeeprofile from './page/emplyee/Edidemployeeprofile.js';
import ForgotPassword from './page/emplyee/forgetpassword.js'


import store from "./page/machine/redux/store";
import Prodetails from "./page/machine/Prodetails";
import AddMachine from "./page/machine/AddMachine";
import AddMachineParts from "./page/machine/AddMachineParts";
import MachineDashboard from "./page/machine/MachineDashboard";
import MachineMaintenance from "./page/machine/MachineMaintenance";
import Product from "./page/machine/Product";
import ProductDetails from "./page/machine/ProductDetails";

import FinancialDashboard from "./page/financial/dashboard";
import Sidebar from "./components/sidebar/sidebar";

// Financial Management Pages
import Income from "./page/financial/income";
import Expense from "./page/financial/expense";
import Salary from "./page/financial/salary";
import Payment from "./page/financial/payment";
import Message from "./page/financial/message";
import PaymentForm from "./page/financial/payment/paymentForm.js";
import PaymentSummary from './page/financial/payment/payment-summary';
import { FiMenu } from "react-icons/fi"; 



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
import OrderTracking from "./page/order/OrderTracking"; 
import Receipt from './page/financial/payment/recept.js';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Router>
        {/* Inventory parth */}
        <Routes>
          <Route path="/inventory/dashboard" element={<Dashboard />} />
          <Route
            path="/inventory/addFinalProduct"
            element={<AddFinalProduct />}
          />
          <Route path="/inventory/inventoryPage" element={<InventoryPage />} />
          <Route
            path="/inventory/rawMaterialList"
            element={<RawMaterialList />}
          />
          <Route
            path="/inventory/addRawMaterial"
            element={<AddRawMaterial />}
          />
          <Route
            path="/inventory/packingMaterialList"
            element={<PackingMaterialList />}
          />
          <Route
            path="/inventory/addPackingMaterial"
            element={<AddPackingMaterial />}
          />
          <Route
            path="/inventory/finalProductList"
            element={<FinalProductList />}
          />
          <Route
            path="/inventory/updateRawMaterial/:id"
            element={<UpdateRawMaterial />}
          />
          <Route
            path="/inventory/updatePackingMaterial/:id"
            element={<UpdatePackingMaterial />}
          />
          <Route
            path="/inventory/updateFinalProduct/:id"
            element={<UpdateFinalProduct />}
          />
          <Route
            path="/inventory/finalProductQR"
            element={<FinalProductQR />}
          />
          <Route path="/inventory/stockMovement" element={<StockMovement />} />
        </Routes>
      </Router>
      <>
        <Router>
          <Routes>
            {/* Financial parth */}
            <Route path="/financialdashboard" element={<FinancialDashboard />}/>
            <Route path="/income" element={<Income />} />
            <Route path="/expense" element={<Expense />} />
            <Route path="/salary" element={<Salary />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/message" element={<Message />} />
            <Route path="/paymentForm" element={<PaymentForm />} />
            <Route path="/payment-summary" element={<PaymentSummary />} />
            <Route path="/receipt/:orderId" element={<Receipt />} />

            {/* Emp parth */}
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/allusers" element={<Allusers />} />
            <Route path="/e_updates/:userid" element={<Userupdate />} />
            <Route path="/requestedleave" element={<Requestedleave />} />
            <Route path="/approveleave" element={<Approveleave />} />
            <Route path="/employeeDashboard" element={<Employeedashboard />} />
            <Route
              path="/employeeProfileDashboard"
              element={<Employeeprofiledashboard />}
            />
            <Route
              path="/employeeAttendance"
              element={<Employeeattendance />}
            />
            <Route path="/e_userprofile" element={<Edidemployeeprofile />} />
            <Route path="/forgetpassword" element={<ForgotPassword />} />
          </Routes>
        </Router>
        <Provider store={store}>
          <Router>
            <Routes>
              {/* Machine parth */}
              <Route path="/machinedashboard" element={<MachineDashboard />} />
              <Route path="/add-machine" element={<AddMachine />} />
              <Route path="/product-details" element={<Prodetails />} />
              <Route path="/machine-parts" element={<AddMachineParts />} />
              <Route path="/maintenance" element={<MachineMaintenance />} />
              <Route path="/product" element={<Product />} />
              <Route
                path="/product/:productName"
                element={<ProductDetails />}
              />

              {/* oder parth */}

              <Route path="/DeliverHome" element={<DeliverHome />} />
              <Route path="/oderdashboard" element={<Delivery />} />
              <Route path="/deliverydetail" element={<DeliveryDetail />} />
              <Route path="/adddelivery" element={<AddDelivery />} />
              <Route path="profile" element={<DeliverAdminProfile />} />
              <Route
                path="/drivervehicledetails"
                element={<DrivervehicleDetails />}
              />
              <Route path="/pendingorders" element={<Orderhistorys />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/logout" element={<Logout />} />

              <Route path="placeorder" element={<PlaceOrder />} />
              <Route
                path="/order-confirmation"
                element={<OrderConfirmation />}
              />
              <Route path="/paymentForm" element={<PaymentForm />} />

              <Route path="/orders/track" element={<OrderTracking />} />
              <Route path="adddelivery/:orderId" element={<AddDelivery />} />
            </Routes>
          </Router>
        </Provider>
      </>
    </>
  );
}

export default App;