// utils/jwtHelper.js
require("dotenv").config(); // Load environment variables from .env
const jwt = require('jsonwebtoken');

// Helper function to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email }, // Payload: User data
    process.env.JWT_SECRET,              // Secret key from .env
    { expiresIn: process.env.JWT_EXPIRATION } // Expiration time
  );
};

module.exports = generateToken;
