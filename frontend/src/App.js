import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./page/financial/dashboard"; 
import Sidebar from "./components/sidebar/sidebar";

// Financial Management Pages
import Income from "./page/financial/income"; 
import Expense from "./page/financial/expense"; 
import Salary from "./page/financial/salary"; 
import Payment from "./page/financial/payment"; 
import Message from "./page/financial/message"; 

function App() {
  return (
    <div className='flex h-screen bg-gray-900 text-gray-100 overflow-hidden'>
			{/* BG */}
			<div className='fixed inset-0 z-0'>
				<div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80' />
				<div className='absolute inset-0 backdrop-blur-sm' />
			</div>
    <Router>
      <div className="flex h-screen">
        {/* Sidebar remains persistent across pages */}
        <Sidebar />  
        
        {/* Main Content Area */}
        <div className="flex-grow p-4">
          <Routes>
            {/* Financial Management Routes */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/income" element={<Income />} /> 
            <Route path="/expense" element={<Expense />} /> 
            <Route path="/salary" element={<Salary />} /> 
            <Route path="/payment" element={<Payment />} /> 
            <Route path="/message" element={<Message />} />
          </Routes>
        </div>
      </div>
    </Router>
    </div>
  );
}

export default App;
