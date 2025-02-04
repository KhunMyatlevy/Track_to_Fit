// middleware/getSessionIdFromRequest.js

const getSessionIdFromRequest = (req, res, next) => {
    const sessionId = req.params.sessionId; // Extract session ID from URL parameters
  
    if (!sessionId) {
      return res.status(400).json({ message: 'Session ID is required' });
    }
  
    req.sessionId = sessionId; // Attach the session ID to the request object
    next(); // Proceed to the next middleware or route handler
  };
  
  module.exports = getSessionIdFromRequest;
  