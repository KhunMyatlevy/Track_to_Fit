const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session', // Reference to the Session model
    required: true,
  },
  name: {
    type: String, // Name of the exercise (e.g., "Bench Press", "Squat")
    required: true,
  },
  weight: {
    type: Number, // The weight used for the exercise
    required: true,
  },
  reps: {
    type: Number, // Number of repetitions performed
    required: true,
  },
});

module.exports = mongoose.model('Exercise', ExerciseSchema);
