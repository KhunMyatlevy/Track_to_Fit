const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const authController = require('../controllers/authController');
const sessionController = require('../controllers/sessionController');
const exerciseController = require('../controllers/exerciseController');
const router = express.Router();

// POST request for logout (authMiddleware checks if the user is logged in)
router.post('/logout', authMiddleware, authController.logout);

//session routes
router.post('/create_session', authMiddleware, sessionController.createSession);
router.get('/fetch_all_sessions', authMiddleware, sessionController.fetchAllSessions);
router.get('/fetch_session_by_id/:sessionId', authMiddleware, sessionController.fetchSessionById);
router.put('/update_session_by_id/:sessionId', authMiddleware, sessionController.updateSessionById);
router.delete('/delete_session_by_id/:sessionId', authMiddleware, sessionController.deleteSessionById);

//exercise routes
router.post('/create_exercise', authMiddleware, exerciseController.createExercise);
router.get('/fetch_exercises_by_session/:sessionId', authMiddleware, exerciseController.getExercisesBySession);
router.get('/fetch_exercise_by_id/:exerciseId', authMiddleware, exerciseController.getExerciseById);
router.put('/update_exercise_by_id/:exerciseId', authMiddleware, exerciseController.updateExercisebyId);
router.delete('/delete_exercise_by_id/:exerciseId', authMiddleware, exerciseController.deleteExerciseById);

module.exports = router;

