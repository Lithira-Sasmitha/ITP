// Add this to your server.js or index.js file where you set up your Express server
const express = require('express');
const app = express();
const cors = require('cors');

// Import your route modules
const expenseRoutes = require('./routes/financialRoute/expencesroute');
const incomeRoutes = require('./routes/financialRoute/incomeroute');

// Middleware
app.use(cors());
app.use(express.json());



// Use routes
app.use('/', expenseRoutes);  // This will handle all your existing expense routes
app.use('/', incomeRoutes);   // This will handle all your new income routes

// Add a simple test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Start server
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});