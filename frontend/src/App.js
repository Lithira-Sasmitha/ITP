import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./page/financial/dashboard"; 

//financial management
import Income from "./page/financial/income"; 
import Expenses from "./page/financial/expenses"; 
import Salary from "./page/financial/salary"; 
import Payment from "./page/financial/payment"; 
import Massege from "./page/financial/massege"; 


function App() {
  return (
    <Router>
      <Routes>
      {/* financial management */}
        <Route path="/dashboard" element={<Dashboard />} />
         <Route path="/income" element={<Income />} /> 
         <Route path="/expenses" element={<Expenses />}/> 
         <Route path="/salary" element={<Salary />}/> 
         <Route path="/payment" element={<Payment />}/> 
         <Route path="/Massege" element={<Massege />}/>

      </Routes>
    </Router>
  );
}

export default App;
