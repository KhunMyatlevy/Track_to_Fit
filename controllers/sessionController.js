const Session = require('../model/Session');
const getUserFromCookies = require('../middleware/getUserFromCookies'); // Import the middleware for cookie validation
const getSessionIdFromRequest = require('../middleware/getSessionIdFromRequest'); // Import the middleware for extracting session ID from the request
const checkSessionOwner = require('../middleware/checkSessionOwner'); // Import the middleware for checking session ownership

// Create a session
const createSession = async (req, res) => {
  try {
    // Make sure getUserFromCookies middleware has set req.userId
    getUserFromCookies(req, res, () => {}); // Call middleware manually inside the function

    const userId = req.userId;

    // Create a new session with the retrieved userId and current date
    const newSession = new Session({
      userId: userId,
      date: new Date(),  // Current date will be automatically used
      exercises: [],  // Blank exercises as specified
    });

    // Save the session to the database
    await newSession.save();

    // Respond with the created session data
    res.status(201).json({ message: 'Session created successfully', session: newSession });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

//Fetch all sessions belong to current user
const fetchAllSessions = async (req, res) => {
  try {
    // Make sure getUserFromCookies middleware has set req.userId
    getUserFromCookies(req, res, () => {}); // Call middleware manually inside the function

    const userId = req.userId;

    // Fetch all sessions that belong to the current user
    const sessions = await Session.find({ userId: userId });

    // Respond with the fetched sessions
    res.status(200).json({ sessions: sessions });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Fetch a specific session by ID (Only if it belongs to the logged-in user)
const fetchSessionById = async (req, res) => {
    try {
      // Call getUserFromCookies middleware manually inside the function
      getUserFromCookies(req, res, () => {});
      
      // Call getSessionIdFromRequest middleware manually inside the function
      getSessionIdFromRequest(req, res, () => {});
  
      // Call checkSessionOwner middleware manually inside the function
      checkSessionOwner(req, res, async () => {
        const userId = req.userId; // Extract userId from cookies
        const sessionId = req.sessionId; // Extract sessionId from request parameters
  
        // Fetch the session that matches the sessionId and belongs to the user
        const session = await Session.findOne({ _id: sessionId, userId });
  
        if (!session) {
          return res.status(404).json({ message: 'Session not found' });
        }
  
        // Respond with the session data
        res.status(200).json({ session });
      });
      
    } catch (error) {
      console.error('Error fetching session:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

// Update a session by ID (Only if it belongs to the logged-in user)
const updateSessionById = async (req, res) => {
    try {
      // Call getUserFromCookies middleware manually inside the function
      getUserFromCookies(req, res, () => {});
      
      // Call getSessionIdFromRequest middleware manually inside the function
      getSessionIdFromRequest(req, res, () => {});
  
      // Call checkSessionOwner middleware manually inside the function
      checkSessionOwner(req, res, async () => {
        const userId = req.userId; // Extract userId from cookies
        const sessionId = req.sessionId; // Extract sessionId from request parameters
        const { date } = req.body; // Extract date from the request body to update the session
  
        // Ensure a valid date is provided
        if (!date || isNaN(new Date(date).getTime())) {
          return res.status(400).json({ message: 'Invalid date format' });
        }
  
        // Find the session by its ID and userId to make sure it belongs to the current user
        const session = await Session.findOne({ _id: sessionId, userId });
  
        if (!session) {
          return res.status(404).json({ message: 'Session not found' });
        }
  
        // Update the session date
        session.date = new Date(date); // Update the date field only
  
        // Save the updated session
        await session.save();
  
        // Respond with the updated session data
        res.status(200).json({ message: 'Session date updated successfully', session });
      });
      
    } catch (error) {
      console.error('Error updating session:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

  // Delete a session by ID (Only if it belongs to the logged-in user)
const deleteSessionById = async (req, res) => {
  try {
    // Call getUserFromCookies middleware manually inside the function
    getUserFromCookies(req, res, () => {});

    // Call getSessionIdFromRequest middleware manually inside the function
    getSessionIdFromRequest(req, res, () => {});

    // Call checkSessionOwner middleware manually inside the function
    checkSessionOwner(req, res, async () => {
      const userId = req.userId; // Extract userId from cookies
      const sessionId = req.sessionId; // Extract sessionId from request parameters

      // Find the session by its ID and userId to make sure it belongs to the current user
      const session = await Session.findOne({ _id: sessionId, userId });

      if (!session) {
        return res.status(404).json({ message: 'Session not found' });
      }

      // Delete the session
      await session.deleteOne();

      // Respond with success message
      res.status(200).json({ message: 'Session deleted successfully' });
    });

  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
  
module.exports = { createSession, fetchAllSessions, fetchSessionById, updateSessionById, deleteSessionById }; // Export the controller functions for use in routes
