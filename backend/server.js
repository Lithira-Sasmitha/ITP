require("dotenv").config(); // Load environment variables

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// Initialize Express App
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Import Database Connection
require("./db");

// Route Imports
const rawMaterialRoutes = require("./routes/inventoryRoutes/rawMaterialRoutes");
const packingMaterialRoutes = require("./routes/inventoryRoutes/packingMaterialRoutes");
const finalProductRoutes = require("./routes/inventoryRoutes/finalProductRoutes");

// Route Middleware
app.use("/api/raw-materials", rawMaterialRoutes);
app.use("/api/packing-materials", packingMaterialRoutes);
app.use("/api/final-products", finalProductRoutes);

// Root Route
app.get("/", (req, res) => {
  res.send("🚀 Inventory Server is Running!");
});

// Start Server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`✅ Server is running at: http://localhost:${port}`);
});
