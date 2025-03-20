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

// Define Routes (Example)
app.get("/", (req, res) => {
  res.send( "Server is running!");
});

// using routes 
app.use(require('../backend/routes/financialRoute/expencesroute'));
app.use(require('../backend/routes/financialRoute/incomeroute'));

// Start Server
const port = process.env.PORT || 5005;
app.listen(port, () => {
  console.log(`Server is running on: http://localhost:${port}`);
});
