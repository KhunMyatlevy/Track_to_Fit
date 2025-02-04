const Session = require('../model/Session');

// Middleware to check if the user is the owner of the session
const checkSessionOwner = async (req, res, next) => {
  try {
    // Get userId and sessionId, which should already be set by other middlewares
    const { userId, sessionId } = req;

    // Find the session by its ID and check if it belongs to the user
    const session = await Session.findOne({ _id: sessionId, userId });

    // If session not found or doesn't belong to the user
    if (!session) {
      return res.status(404).json({ message: 'Session not found or you are not the owner' });
    }

    // If session is found and belongs to the user, proceed
    next();
  } catch (error) {
    console.error('Error checking session ownership:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = checkSessionOwner;
