require("dotenv").config(); // Load environment variables from .env
const jwt = require('jsonwebtoken'); // Changed to `jwt` for clarity

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;  // Get the token from cookies
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Corrected this line
        req.user = decoded;  // Store decoded info in req.user
        next();  // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });  // If the token is invalid or expired
    }
};

module.exports = authMiddleware;
