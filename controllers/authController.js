const User = require('../model/User');
const VerificationCode = require('../model/VerificationCode');
const bcrypt = require('bcrypt');
const transporter = require('../utils/emailConfig');
const generateVerificationCode = require('../utils/generateVerificationCode');
const sendVerificationEmail = require('../utils/sendEmail');
const generateToken = require('../utils/jwtHelper');


// Register user
const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with isVerified: false
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      isVerified: false, // User is not verified yet
    });

    // Save the user to the database
    await newUser.save();

    // Generate a verification code
    const verificationCode = generateVerificationCode();

    // Set expiration time (e.g., 10 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // Save the verification code to the database
    const newVerificationCode = new VerificationCode({
      email,
      code: verificationCode,
      expiresAt,
    });
    await newVerificationCode.save();

    // Prepare the email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify Your Email',
      text: `Your verification code is: ${verificationCode}`,
    };

    // Use the sendVerificationEmail function from utils
    const result = await sendVerificationEmail(mailOptions, res);

    // Send a response after email is sent
    res.status(201).json({ message: result.message });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

//login function
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User does not exist' });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(400).json({ message: 'User is not verified' });
    }

    // Check if the password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Generate a token
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
  

    // Send the token in the response
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

const logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logout successful' });
}

module.exports = { register, login, logout };
