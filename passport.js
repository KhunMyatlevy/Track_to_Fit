const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./model/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {

        console.log("Google Profile Data:", profile); // Log the Google profile data

        // Check if user already exists with the Google email
        const existingUser = await User.findOne({ email: profile.emails[0].value });

        if (existingUser) {
          // If user exists, log them in
          return done(null, existingUser);
        }

        // If user doesn't exist, create a new user
        const newUser = new User({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          password: profile.emails[0].value.split('@')[0], // Generate password from email (without @gmail.com)
        });

        // Save the new user to the database
        await newUser.save();
        done(null, newUser); // Log the newly created user in
      } catch (err) {
        done(err);
      }
    }
  )
);

// Serialize the user ID to store in session
passport.serializeUser((user, done) => done(null, user.id));

// Deserialize the user from session using the ID
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
