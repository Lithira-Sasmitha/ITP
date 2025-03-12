import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./page/financial/Layout"; 

// import Income from "./page/financial/income"; 


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />} />

        {/* <Route path="/income" element={<Income />} /> */}

      </Routes>
    </Router>
  );
}

export default App;
