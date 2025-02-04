const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verificationController = require('../controllers/verificationController');


// Authentication routes
router.post('/register', authController.register);
router.post('/verify-email', verificationController.verifyEmail);
router.post('/login', authController.login);


module.exports = router;