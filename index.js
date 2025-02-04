require("dotenv").config(); // Load environment variables from .env

const express = require("express");
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

// Import models
const User = require('./model/User');
const VerificationCode = require('./model/VerificationCode');
const Session = require('./model/Session');
const Exercise = require('./model/Exercise');

// Import routes
const authRoutes = require("./routes/routes"); // Adjust path if needed
const protectedRoutes = require("./routes/protected_routes.js");


const app = express();

// Access MongoDB URI from environment variables
const mongoURI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(cookieParser()); // Parse cookies

// Use authentication routes
app.use("/api", authRoutes); // Prefix all routes with /api
app.use("/private", protectedRoutes);



// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
