import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./page/machine/Layout";
// import DeliverHome from "./components/DeliverHome";
// import Delivery from "./components/Delivery";
// import DeliveryDetail from "./components/Deliverydetail";
// import AddDelivery from "./components/AddDelivery";
// import DrivervehicleDetails from "./components/DrivervehicleDetails";
//import Settings from "./page/order/Settings";
 //import Logout from "./page/order/Logout";
// import DeliverAdminProfile from "./components/DeliverAdminProfile";
// import AddOrder from "./page/order/AddOrder";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* <Route index element={<DeliverHome />} />*/}
          {/*<Route path="profile" element={<DeliverAdminProfile />} />*/}
          {/*<Route path="dashboard" element={<Delivery />} />
           */}
          {/* <Route path="deliverydetail" element={<DeliveryDetail />} />
           */}
          {/*<Route path="adddelivery" element={<AddDelivery />} /> */}
          {/* <Route path="addorder" element={<AddOrder />} /> */}
          {/*  <Route
            path="drivervehicledetails"
            element={<DrivervehicleDetails />}
          />{" "}
          */}
          {/*<Route path="settings" element={<Settings />} /> */}
           {/*<Route path="logout" element={<Logout />} /> */} 
        </Route>
      </Routes>
    </Router>
  );
}

export default App;