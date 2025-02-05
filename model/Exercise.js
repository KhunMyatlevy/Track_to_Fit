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
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
});

// Add index on userId for faster querying
ExerciseSchema.index({ userId: 1 });
// Add index on sessionId for faster querying
ExerciseSchema.index({ sessionId: 1 });


module.exports = mongoose.model('Exercise', ExerciseSchema);
