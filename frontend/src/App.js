import "./App.css";
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
 

function App() {
  return (
    <Provider store={store}>
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
  );
}

export default App;