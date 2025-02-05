const Exercise = require('../model/Exercise');
const getSessionIdFromRequest = require('../middleware/getSessionIdFromRequest');
const getUserFromCookies = require('../middleware/getUserFromCookies');
const mongoose = require('mongoose');

const createExercise = async (req, res) => {
    try {
      // Manually call the middleware to get userId from cookies
      getUserFromCookies(req, res, async () => {
        const { sessionId, name, weight, reps } = req.body;
  
        // Validate required fields
        if (!sessionId || !name || !weight || !reps) {
          return res.status(400).json({ message: 'All fields are required' });
        }
  
        // Check if sessionId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(sessionId)) {
          return res.status(400).json({ message: 'Invalid sessionId' });
        }
  
        // Get userId from cookies (set by getUserFromCookies middleware)
        const userId = req.userId;
  
        // Create a new exercise with the sessionId, userId, name, weight, and reps
        const newExercise = new Exercise({
          sessionId,
          userId, // Add userId here
          name,
          weight,
          reps,
        });
  
        // Save the new exercise to the database
        await newExercise.save();
  
        res.status(201).json({ message: 'Exercise created successfully', exercise: newExercise });
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

  const getExercisesBySession = async (req, res) => {
    try {
      // Manually call the middleware to get sessionId
      getSessionIdFromRequest(req, res, async () => {
        const sessionId = req.sessionId; // Get sessionId from middleware
  
        // Validate sessionId
        if (!sessionId) {
          return res.status(400).json({ message: 'sessionId is required' });
        }
  
        // Check if sessionId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(sessionId)) {
          return res.status(400).json({ message: 'Invalid sessionId' });
        }
  
        // Find exercises for the given sessionId
        const exercises = await Exercise.find({ sessionId });
  
        if (!exercises.length) {
          return res.status(404).json({ message: 'No exercises found for this session' });
        }
  
        res.status(200).json({ exercises });
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

const getExerciseById = async (req, res) => {
  try {
    // First, get the userId from cookies by using the getUserFromCookies middleware
    getUserFromCookies(req, res, async () => {
      const { exerciseId } = req.params;

      // Validate if the exerciseId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(exerciseId)) {
        return res.status(400).json({ message: 'Invalid exerciseId' });
      }

      // Find the exercise by its ID
      const exercise = await Exercise.findById(exerciseId);

      // Check if exercise is found
      if (!exercise) {
        return res.status(404).json({ message: 'Exercise not found' });
      }

      // Check if the current user is the owner of the exercise
      if (exercise.userId.toString() !== req.userId.toString()) {
        return res.status(403).json({ message: 'You are not the owner of this exercise' });
      }

      // Return the exercise data
      res.status(200).json({ exercise });
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateExercisebyId = async (req, res) => {
  try {
    // First, get the userId from cookies by using the getUserFromCookies middleware
    getUserFromCookies(req, res, async () => {
      const { exerciseId } = req.params;
      const { name, weight, reps } = req.body;

      // Validate if the exerciseId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(exerciseId)) {
        return res.status(400).json({ message: 'Invalid exerciseId' });
      }

      // Find the exercise by its ID
      const exercise = await Exercise.findById(exerciseId);

      // Check if exercise is found
      if (!exercise) {
        return res.status(404).json({ message: 'Exercise not found' });
      }

      // Check if the current user is the owner of the exercise
      if (exercise.userId.toString() !== req.userId.toString()) {
        return res.status(403).json({ message: 'You are not the owner of this exercise' });
      }

      // Update the exercise with the new data
      exercise.name = name;
      exercise.weight = weight;
      exercise.reps = reps;

      // Save the updated exercise
      await exercise.save();

      // Return the updated exercise data
      res.status(200).json({ message: 'Exercise updated successfully', exercise });

    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteExerciseById = async (req, res) => {
    try {
        // First, get the userId from cookies by using the getUserFromCookies middleware
        getUserFromCookies(req, res, async () => {
        const { exerciseId } = req.params;
    
        // Validate if the exerciseId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(exerciseId)) {
            return res.status(400).json({ message: 'Invalid exerciseId' });
        }
    
        // Find the exercise by its ID
        const exercise = await Exercise.findById(exerciseId);
    
        // Check if exercise is found
        if (!exercise) {
            return res.status(404).json({ message: 'Exercise not found' });
        }
    
        // Check if the current user is the owner of the exercise
        if (exercise.userId.toString() !== req.userId.toString()) {
            return res.status(403).json({ message: 'You are not the owner of this exercise' });
        }
    
        // Delete the exercise
        await exercise.deleteOne();
    
        // Return success message
        res.status(200).json({ message: 'Exercise deleted successfully' });
    
        });
    
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createExercise, getExercisesBySession, getExerciseById, updateExercisebyId, deleteExerciseById };

