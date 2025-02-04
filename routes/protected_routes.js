const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const authController = require('../controllers/authController');
const sessionController = require('../controllers/sessionController');
const router = express.Router();

// POST request for logout (authMiddleware checks if the user is logged in)
router.post('/logout', authMiddleware, authController.logout);

// GET request for private route (authMiddleware ensures the user is logged in)
router.get('/private', authMiddleware, (req, res) => {
  res.status(200).json({ message: 'Hello, welcome to the private route!' });
});

//session routes
router.post('/create_session', authMiddleware, sessionController.createSession);
router.get('/fetch_all_sessions', authMiddleware, sessionController.fetchAllSessions);
router.get('/fetch_session_by_id/:sessionId', authMiddleware, sessionController.fetchSessionById);
router.put('/update_session_by_id/:sessionId', authMiddleware, sessionController.updateSessionById);
router.delete('/delete_session_by_id/:sessionId', authMiddleware, sessionController.deleteSessionById);

module.exports = router;

