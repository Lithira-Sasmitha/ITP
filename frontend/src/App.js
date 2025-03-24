import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./page/order/Layout";
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
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DeliverHome />} />
          <Route path="dashboard" element={<Delivery />} />
          <Route path="deliverydetail" element={<DeliveryDetail />} />
          <Route path="adddelivery" element={<AddDelivery />} />
          <Route path="profile" element={<DeliverAdminProfile />} />
          <Route
            path="drivervehicledetails"
            element={<DrivervehicleDetails />}
          />
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
    </Router>
  );
}

export default App;
