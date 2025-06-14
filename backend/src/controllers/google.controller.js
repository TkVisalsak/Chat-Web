import OAuthUser from "../models/oAuth.model.js";
import { generateToken } from "../lib/utils.js";



export const googleCallback = async (req, res) => {
  try {
    console.log("🔍 googleCallback hit");

    if (!req.user) {

      return res.status(400).json({ message: "Authentication failed. No user returned from Passport." });
    }

    const user = req.user;
    

    generateToken(user._id, res);
   

    const existingUser = await OAuthUser.findById(user._id); 
  

    if (!existingUser) {
  
      return res.status(404).json({ message: "User not found" });
    }

    const isProfileComplete =
      existingUser.firstName && existingUser.lastName && existingUser.dob && existingUser.gender;



    if (isProfileComplete) {
      res.redirect("http://127.0.0.1:5500/frontend/public/main.html");
    } else {
      res.redirect("http://127.0.0.1:5500/frontend/public/google-info.html");
    }

  } catch (error) {
    res.status(500).json({ message: "Internal server error in callback" });
  }
};



// 👇 Authenticated route to get full profile info
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    // ✅ FIXED: Use findById instead of broken "findOne({ email })"
    const user = await OAuthUser.findById(userId).select(
      "email userName displayName profilePic"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.log("Error in getUserProfile:", error.message);
    res.status(500).json({ message: "Internal Server Error in getuserprofile" });
  }
};

// 👇 Authenticated route to get just email and username
export const getUserEmail = async (req, res) => {
  try {
    res.status(200).json({
      email: req.user.email,
      userName: req.user.userName,
    });
  } catch (error) {
    console.log("Error in getUserEmail:", error.message);
    res.status(500).json({ message: "Internal Server Error in getuseremail" });
  }
};


export const oAuthPersonal_info = async (req, res) => {
  const { firstName, lastName, dob, gender } = req.body;
  const userId = req.user._id;

  try {
    if (!firstName || !lastName || !dob) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userId = req.user._id; // Assumes middleware sets req.user
    const user = await OAuthUser.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.dob = dob;
    user.gender = gender;

    await user.save();

    res.status(200).json({ message: "Personal information updated successfully" });
  } catch (error) {
    console.log("Error in personal_info", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};