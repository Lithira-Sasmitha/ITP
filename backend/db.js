require("dotenv").config();
const mongoose = require("mongoose");

// MongoDB Connection URL
const mongoURL = process.env.MONGO_URL || "your_fallback_mongodb_url";

mongoose
  .connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

module.exports = mongoose;
 