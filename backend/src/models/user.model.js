import mongoose from "mongoose";

const  userSchema = new mongoose.Schema(
{
    email: {
        type: String,
        required: true,
        unique: true,
    },
    userName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    profilePic:{
        type: String,
        default: "",
    },
    firstName:{
        type: String,
        default: "",
    },
    lastName:{
        type: String,
        default: "",
    },
    dob:{
        type: String,
        default: "",
    },
    gender:{
        type: String,
        default: "",
    },

},
    {timestamps: true}
);

const User = mongoose.model("User",userSchema);

export default User;