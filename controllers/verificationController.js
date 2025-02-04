const User = require('../model/User');
const VerificationCode = require('../model/VerificationCode');
const generateToken = require('../utils/jwtHelper');

// Verify user
const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    // Find the verification code
    const verificationCodeEntry = await VerificationCode.findOne({ email, code });
    if (!verificationCodeEntry) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    // Check if the code has expired
    if (verificationCodeEntry.expiresAt < new Date()) {
      await VerificationCode.deleteOne({ email, code }); // Clean up expired code
      return res.status(400).json({ message: 'Verification code has expired' });
    }

    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Mark the user as verified
    user.isVerified = true;
    await user.save();

    // Delete the verification code
    await VerificationCode.deleteOne({ email, code });

    const token = generateToken(user);

    // Set the token in cookies
    res.cookie('token', token,{
      httpOnly: true,
      secure: true, // Change to true if using HTTPS
      sameSite: 'None', // front end and back end are on different domains
  });

    // Set the userId in a cookie
    res.cookie('userId', user._id, {
      httpOnly: true,
      secure: true, // Change to true if using HTTPS
      sameSite: 'None', // front end and back end are on different domains
      maxAge: 24 * 60 * 60 * 1000, // Optional: Set expiration time for userId (1 day)
    });
  

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Error during verification:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { verifyEmail };
