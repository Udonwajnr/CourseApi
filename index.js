const express = require('express');
const app = express();
const dotenv = require('dotenv');
const colors = require('colors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Middleware
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/course', require('./route/courseRoute'));
app.use('/api/payment', require("./route/paymentRoutes"));

// Connect to the database
connectDB();

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`.green);
});
