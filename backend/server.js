require("dotenv").config();
const express = require("express");
const mongoose = require("./db");
const cors = require("cors");
const path = require("path");

const productRoutes = require("./routes/productRoutes");
const machineRoutes = require("./routes/machineRoutes");
const machinepartRoutes = require("./routes/machinepartRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

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

app.get("/", (req, res) => {
  res.send("🚀 Server is running!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  res.status(500).json({ message: "Server Error", error: err.message });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.log(`⚠ Port ${PORT} is in use. Trying another port...`);
    app.listen(0, () => {
      console.log(`Server started on a random port`);
    });
  } else {
    console.error(`Server error: ${err.message}`);
  }
});