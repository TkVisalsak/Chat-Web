import mongoose from "mongoose";

const oAuthUserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  userName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  profilePic: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  firstName: {
    type: String,
    default: "",
  },
  lastName: {
    type: String,
    default: "",
  },
  dob: {
    type: String,
    default: "",
  },
  gender: {
    type: String,
    default: "",
  },
  // other fields if needed
});

const OAuthUser = mongoose.model("OAuthUser", oAuthUserSchema);
export default OAuthUser;
