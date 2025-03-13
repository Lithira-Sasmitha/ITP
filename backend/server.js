 
require("dotenv").config();
const express = require("express");
const mongoose = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware (optional)
app.use(express.json());

// Sample route
app.get("/", (req, res) => {
  res.send("🚀 Server is running!");
});

// Start server and handle port conflicts
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.log(`⚠ Port ${PORT} is in use. Trying another port...`);
    app.listen(0, () => {
      console.log(`✅ Server started on a random port`);
    });
  }
});