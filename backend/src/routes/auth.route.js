import express from "express";
import passport from "passport";
import {
  checkAuth,
  login,
  logout,
  signup,
  updateProfile,
  personal_info,
} from "../controllers/auth.controller.js";
import {
  getUserProfile,
  getUserEmail,
  googleCallback,
  oAuthPersonal_info,
} from "../controllers/google.controller.js";


import { protectRoute } from "../middleware/auth.middleware.js";
import { protectAuthRoute } from "../middleware/oAuth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/personal_info", protectRoute, personal_info);
router.put("/update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, checkAuth);
router.get("/getUserEmail", protectRoute, getUserEmail);

// 👇 Google OAuth
router.get("/google",passport.authenticate("google", { scope: ["profile", "email"] }));

// Handle the callback after Google has authenticated the user
router.get(
  "/google/callback",passport.authenticate("google", { failureRedirect: "/login", session: false }),googleCallback
);
router.post("/oAuthPersonal_info", protectAuthRoute, oAuthPersonal_info);



export default router;
