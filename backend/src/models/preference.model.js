import mongoose from "mongoose";

const preferenceSchema = new mongoose.Schema(
  { 
    
    User: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ActiveStatus: {
      type: Boolean,
      default: false,
    },
    mute: {
      type: Boolean,
      default: false,
    },
    notification: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const UserPreference = mongoose.model("UserPreference", preferenceSchema);
export default UserPreference;
