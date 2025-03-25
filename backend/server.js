// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("./db");
const cors = require("cors");
const path = require("path");

const app = express();
const db = require('./db');

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing form data
app.use(cors());

// Import your route modules
const expenseRoutes = require('./routes/financialRoute/expencesroute');
const incomeRoutes = require('./routes/financialRoute/incomeroute');

const driverRoutes = require("./routes/driverRoutes");
const orderRoutes = require("./routes/orderRoutes");
const deliveryRoutes = require("./routes/deliveryRoutes");

const productRoutes = require("./routes/productRoutes");
const machineRoutes = require("./routes/machineRoutes");
const machinepartRoutes = require("./routes/machinepartRoutes");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/products", productRoutes);
app.use("/api/machines", machineRoutes);
app.use("/api/machineparts", machinepartRoutes);
app.use('/', expenseRoutes);
app.use('/', incomeRoutes);

app.use("/api/drivers", driverRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/deliveries", deliveryRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


