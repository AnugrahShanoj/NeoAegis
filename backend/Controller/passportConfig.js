// Here we implement actual  logic to find or create the user in the database through google authentication

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../Models/userSchema'); // Import your User Schema

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, // From Google Cloud Console
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback', // Redirect URI
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ email: profile.emails[0].value });

        // If not, create a new user
        if (!user) {
          user = new User({
            username: profile.displayName,
            email: profile.emails[0].value,
            profilePic: profile.photos[0]?.value || '',
            googleId: profile.id, // Save Google ID
            role: 'user', // Default role
          });
          console.log("User being saved: ",user)
          await user.save();
        }

        return done(null, user); // Pass user data to the next step
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
