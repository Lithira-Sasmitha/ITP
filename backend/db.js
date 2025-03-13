 
require("dotenv").config();
const mongoose = require("mongoose");

// MongoDB Connection URL from .env file
const mongoURL = process.env.MONGO_URL || "your_fallback_mongodb_url";

// Connect to MongoDB
mongoose.connect(mongoURL)
  .then(() => console.log("✅ MongoDB connection successful"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

module.exports = mongoose;