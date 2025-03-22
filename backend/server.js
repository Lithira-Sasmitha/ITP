require("dotenv").config(); // Load environment variables

const express = require("express");
const cors = require("cors");

// Initialize Express App
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Built-in body parser

// Import Database Connection
require("./db");

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
