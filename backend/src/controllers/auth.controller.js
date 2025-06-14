import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";


export const signup = async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    if (!userName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // generate jwt token here
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const {email, password} = req.body
    try {
      const user = await User.findOne({email});
      if(!user){
        return res.status(400).json({message:"Invalid Username or Password"});
      }

     const isPasswordCorrect = await bcrypt.compare(password, user.password);
     if(!isPasswordCorrect){
        return res.status(400).json({message:"Invalid Username or Password"});
     }
     generateToken(user._id, res);

     res.status(200).json({
        _id: user._id,
        userName: user.userName,
        email: user.email,
        profilePic: user.profilePic,
     });
    } catch (error) {
      console.log("Error in login", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
} ;

export const logout =  (req, res) => {
    try {
      res.cookie("jwt", "", {maxAge:0});
      res.status(200).json({message: "Logged out successfully"});
    } catch (error) {
      console.log("Error in logout", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
} ;
export const personal_info = async (req, res) => {
  const { firstName, lastName, dob, gender } = req.body;
  const userId = req.user._id;

  try {
    if (!firstName || !lastName || !dob) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userId = req.user._id; // Assumes middleware sets req.user
    const user = await User.findById(userId);

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

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

