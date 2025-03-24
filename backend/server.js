require("dotenv").config(); // Load environment variables

// Initialize Express App
// Add this to your server.js or index.js file where you set up your Express server
const express = require('express');
const app = express();
const cors = require('cors');

// Import database connection
const db = require('./db');

// Import your route modules
const expenseRoutes = require('./routes/financialRoute/expencesroute');
const incomeRoutes = require('./routes/financialRoute/incomeroute');


// Middleware
app.use(cors());
app.use(express.json()); 


// Route Imports
const rawMaterialRoutes = require("./routes/inventoryRoutes/rawMaterialRoutes");
const packingMaterialRoutes = require("./routes/inventoryRoutes/packingMaterialRoutes");
const finalProductRoutes = require("./routes/inventoryRoutes/finalProductRoutes");

// Route Middleware
app.use("/api/rawMaterial", rawMaterialRoutes);
app.use("/api/packingMaterial", packingMaterialRoutes);
app.use("/api/finalProduct", finalProductRoutes);


// Root Route
app.get("/", (req, res) => {
  res.send("inventory Server is Running!");
});

// Error handling for unknown routes (optional but good)
app.use((req, res) => {
  res.status(404).json({ message: "Route Not Found" });
});

// Start Server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running at: http://localhost:${port}`);
});
// Use routes
app.use('/', expenseRoutes);  // This will handle all your existing expense routes
app.use('/', incomeRoutes);
   

// Add a simple test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Start server
const PORT = process.env.PORT || 5055;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
