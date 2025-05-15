// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("./db");
const cors = require("cors");
const path = require("path");

const app = express();
const db = require('./db');

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Import your route modules
const paymentRoutes = require("./routes/financialRoute/paymentroute");
const expenseRoutes = require('./routes/financialRoute/expencesroute');
const incomeRoutes = require('./routes/financialRoute/incomeroute');
const salaryroute = require('./routes/financialRoute/salaryroute')

//EMP
const usersRoute = require("./routes/usersRoute");
const leaveRoute= require("./routes/leavesRoutes")
const attendanceInRoute=require("./routes/AttendanceIn_Routes.js")
const attendanceOutRoute=require("./routes/AttendanceOut_Routes.js")
const forgetpasswordRoute = require("./routes/forgotpasswordRout.js");

app.use("/api/users", usersRoute);
app.use("/api/leaves", leaveRoute);
app.use("/api/attendanceIn",attendanceInRoute);
app.use("/api/attendanceOut",attendanceOutRoute);
app.use("/api/resetpassword", forgetpasswordRoute);

// Route Imports
const rawMaterialRoutes = require("./routes/inventoryRoutes/rawMaterialRoutes");
const packingMaterialRoutes = require("./routes/inventoryRoutes/packingMaterialRoutes");
const finalProductRoutes = require("./routes/inventoryRoutes/finalProductRoutes");
const stockMovementRoutes = require("./routes/inventoryRoutes/stockMovementRoutes");
const warehouseEmailRoutes = require("./routes/inventoryRoutes/warehouseEmailRoutes");

// Route Middleware
app.use("/api/rawMaterial", rawMaterialRoutes);
app.use("/api/packingMaterial", packingMaterialRoutes);
app.use("/api/finalProduct", finalProductRoutes);
app.use("/api/stockMovement", stockMovementRoutes);
app.use("/api/warehouseEmail", warehouseEmailRoutes);

const driverRoutes = require("./routes/driverRoutes");
const orderRoutes = require("./routes/orderRoutes");
const deliveryRoutes = require("./routes/deliveryRoutes");

const productRoutes = require("./routes/productRoutes");
const machineRoutes = require("./routes/machineRoutes");
const machinepartRoutes = require("./routes/machinepartRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/products", productRoutes);
app.use("/api/machines", machineRoutes);
app.use("/api/machineparts", machinepartRoutes);
app.use("/api/maintenance", maintenanceRoutes);

app.use('/', expenseRoutes);
app.use('/', incomeRoutes);
app.use('/',salaryroute);
app.use("/api/payments", paymentRoutes);

app.use("/api/drivers", driverRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/deliveries", deliveryRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

