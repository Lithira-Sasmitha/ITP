require("dotenv").config();
const express = require("express");
const mongoose = require("./db");
const cors = require("cors");
const path = require("path");

const productRoutes = require("./routes/productRoutes");
const machineRoutes = require("./routes/machineRoutes");
const machinepartRoutes = require("./routes/machinepartRoutes");

const app = express();
// Add this to your server.js or index.js file where you set up your Express server


// Import database connection
const db = require('./db');

// Import your route modules
const expenseRoutes = require('./routes/financialRoute/expencesroute');
const incomeRoutes = require('./routes/financialRoute/incomeroute');


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing form data
app.use(cors());

// Serve static files from the uploads directory
// This makes files accessible via http://localhost:5000/uploads/...
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/products", productRoutes);
app.use("/api/machines", machineRoutes);
app.use("/api/machineparts", machinepartRoutes);



// Use routes
app.use('/', expenseRoutes);  // This will handle all your existing expense routes
app.use('/', incomeRoutes);
   

// Add a simple test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
