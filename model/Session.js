const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  date: {
    type: Date,
    default: Date.now, // Defaults to the current date if not provided
  },
  exercises: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exercise', // Reference to the Exercise model
    },
  ],
});

module.exports = mongoose.model('Session', SessionSchema);
