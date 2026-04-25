import mongoose from "mongoose";

const userschema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
  },
  mobile: {
    type: String,
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  otp: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("userdetails", userschema);
