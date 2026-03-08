const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../Models/userSchema');

passport.use(
  new GoogleStrategy(
    {
      clientID:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // ✅ Uses BACKEND_URL from .env — never hardcoded
      callbackURL: `${process.env.BACKEND_URL || 'http://localhost:3000'}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          user = new User({
            username:   profile.displayName,
            email:      profile.emails[0].value,
            profilePic: profile.photos[0]?.value || '',
            googleId:   profile.id,
            role:       'user',
            paymentStatus: false,
          });
          console.log("New Google user being saved:", user.email)
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        console.error("Error during Google authentication:", err)
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("Serializing User Id:", user.id)
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    console.log("Deserializing User:", user?.email)
    done(null, user);
  } catch (err) {
    console.error("Error during deserialization:", err)
    done(err, null);
  }
});

module.exports = passport;