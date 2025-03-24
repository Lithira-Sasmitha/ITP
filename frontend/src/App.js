import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./components/login/index.jsx"; 
import Signup from "./components/register/index.js";
import Home from "./components/home/index.js";


import Allusers from "./page/emplyee/Allusers.js";
import Userupdate from "./page/emplyee/Userupdate.js"
import Requestedleave from "./page/emplyee/Requestedleave.js";
import Approveleave from "./page/emplyee/Approveleave.js";


import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
         

        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/allusers" element={<Allusers/>} />
        <Route path="/e_updates/:userid" element={<Userupdate/>}/>
        <Route path="/requestedleave" element={<Requestedleave/>}/>
        <Route path="/approveleave" element={<Approveleave/>}/>


      
      </Routes>
    </Router>
  );
}

export default App;
