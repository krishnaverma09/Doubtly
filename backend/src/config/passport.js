const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        // Get role from state parameter (passed during OAuth initiation)
        const role = (req.query.state && req.query.state !== 'undefined') ? req.query.state : "student";

        let user = await User.findOne({ email });
        const avatar = profile.photos && profile.photos[0] ? profile.photos[0].value : null;

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email,
            googleId: profile.id,
            avatar: avatar,
            role,
          });
        } else if (!user.googleId) {
          user.googleId = profile.id;
          if (!user.avatar && avatar) user.avatar = avatar;
          // Update role only if user doesn't have one or is switching roles
          if (role && user.role !== role) user.role = role;
          await user.save();
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);
