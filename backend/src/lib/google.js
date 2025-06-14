import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import OAuthUser from "../models/oAuth.model.js";
import dotenv from "dotenv";
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://127.0.0.1:5001/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value || "";
        const username = email.split("@")[0];

        let user = await OAuthUser.findOne({
          $or: [{ googleId: profile.id }, { email }],
        });

        if (user) {
          return done(null, user);
        } else {
          user = new OAuthUser({
            googleId: profile.id,
            email,
            userName: username,
            displayName: profile.displayName,
            profilePic: profile.photos?.[0]?.value || "",
          });

          await user.save();
          return done(null, user);
        }
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Add these to support session-based login (optional, even if you use JWT)
passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await OAuthUser.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
