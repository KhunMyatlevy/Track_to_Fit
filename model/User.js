const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    required: false,
  },
  bio: {
    type: String,
    required: false,
  },
  img: {
    type: String, // URL or path to the profile image
    required: false,
  },
  strongestExercises: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exercise', // Reference to the Exercise model
    },
  ],
});

module.exports = mongoose.model('User', UserSchema);
