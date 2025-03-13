import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './components/login/index.jsx'; // Import your SignIn component
import Signup from './components/register/index.js'
import './App.css';

function App() {
  return (
    <Router>
      
        <Routes>
          <Route path="/signin" element={<SignIn/>} />
          <Route path="/signup" element={<Signup/>} />
        </Routes>
     
    </Router>

  );
}

export default App;
