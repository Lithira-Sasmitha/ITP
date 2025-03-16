import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./page/order/Layout";
import Delivery from "./page/order/Delivery";
import DeliveryDetail from "./page/order/Deliverydetail";
import AddDelivery from "./page/order/AddDelivery";
import DrivervehicleDetails from "./page/order/DrivervehicleDetails";
import Settings from "./page/order/Settings";
import Logout from "./page/order/Logout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<Delivery />} />
          <Route path="deliverydetail" element={<DeliveryDetail />} />
          <Route path="adddelivery" element={<AddDelivery />} />
          <Route
            path="drivervehicledetails"
            element={<DrivervehicleDetails />}
          />
          <Route path="settings" element={<Settings />} />
          <Route path="logout" element={<Logout />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
