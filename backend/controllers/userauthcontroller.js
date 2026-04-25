import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";
import Userauthmodal from "../models/Userauthmodal.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import twilio from "twilio";

// --- Twilio Setup ---
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const serviceSid = process.env.TWILIO_SERVICE_SID;

// --- 1. SIGNUP LOGIC (Email or Mobile) ---
export const signup = async (req, res) => {
  try {
    const { username, identifier, password } = req.body;

    const isEmail = identifier.includes("@");
    const query = isEmail ? { email: identifier } : { mobile: identifier };

    let user = await Userauthmodal.findOne(query);

    if (user) {
      if (user.isVerified) {
        return res.status(400).json({
          message: `${isEmail ? "Email" : "Mobile number"} already registered! Please login.`,
        });
      }
      const salt = await bcrypt.genSalt(10);
      user.username = username;
      user.password = await bcrypt.hash(password, salt);
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedpassword = await bcrypt.hash(password, salt);
      user = new Userauthmodal({
        username,
        password: hashedpassword,
        [isEmail ? "email" : "mobile"]: identifier,
      });
    }

    let emailOtp;
    if (isEmail) {
      emailOtp = Math.floor(1000 + Math.random() * 9000).toString();
      user.otp = emailOtp;
    }

    if (isEmail) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: identifier,
        subject: "Anil-shopyfy verify your account",
        html: `<h1>Welcome ${username}!</h1><p>Your OTP is <b>${emailOtp}</b>. Keep it secret!</p>`,
      });
    } else {
      await client.verify.v2
        .services(serviceSid)
        .verifications.create({ to: `+91${identifier}`, channel: "sms" });

      console.log(` Real OTP sent to mobile: +91${identifier}`);
    }

    await user.save();

    res.status(201).json({
      message: `OTP sent to your ${isEmail ? "email" : "mobile"}! Please verify.`,
    });
  } catch (error) {
    console.error("DETAILED_ERROR:", error);
    res.status(500).json({ message: "Backend error: " + error.message });
  }
};

//   VERIFY OTP LOGIC
export const verifyotp = async (req, res) => {
  try {
    const { identifier, otp } = req.body;
    const isEmail = identifier.includes("@");
    const query = isEmail ? { email: identifier } : { mobile: identifier };

    const user = await Userauthmodal.findOne(query);

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    if (isEmail) {
      if (user.otp != otp) {
        return res.status(400).json({ message: "Invalid OTP, check again!" });
      }
    } else {
      const verificationCheck = await client.verify.v2
        .services(serviceSid)
        .verificationChecks.create({ to: `+91${identifier}`, code: otp });

      if (verificationCheck.status !== "approved") {
        return res
          .status(400)
          .json({ message: "Invalid or Expired Mobile OTP!" });
      }
    }

    user.isVerified = true;
    user.otp = undefined;
    await user.save();

    res.status(200).json({ message: "Account verified successfully!" });
  } catch (error) {
    console.error("VERIFY_OTP_ERROR:", error);
    res.status(500).json({ message: "Server error." });
  }
};

//   RESEND OTP LOGIC
export const resendotp = async (req, res) => {
  try {
    const { identifier } = req.body;
    const isEmail = identifier.includes("@");
    const query = isEmail ? { email: identifier } : { mobile: identifier };

    const user = await Userauthmodal.findOne(query);
    if (!user) return res.status(404).json({ message: "User not found!" });

    if (isEmail) {
      const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
      user.otp = newOtp;
      await user.save();

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      });
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: identifier,
        subject: "New OTP for Anil-shopyfy",
        html: `<p>Your new OTP is <b>${newOtp}</b>.</p>`,
      });
    } else {
      await client.verify.v2
        .services(serviceSid)
        .verifications.create({ to: `+91${identifier}`, channel: "sms" });

      console.log(` New Real OTP sent to mobile: +91${identifier}`);
    }

    res.status(200).json({ message: "New OTP sent successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Resend failed: " + error.message });
  }
};

// --- 4. SIGNIN LOGIC ---
export const signin = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    console.log("Login Attempt:", identifier);

    const isEmail = identifier.includes("@");
    const query = isEmail ? { email: identifier } : { mobile: identifier };

    const user = await Userauthmodal.findOne(query);
    if (!user) {
      return res
        .status(404)
        .json({ message: "Account not find signup first!" });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: "verify otp first!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "password incorrect!" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "anil_secret_key",
      { expiresIn: "600d" },
    );

    res.status(200).json({
      message: "Login Success!",
      token,
      user: {
        username: user.username,
        email: user.email || null,
        mobile: user.mobile || null,
      },
    });
  } catch (error) {
    console.error("SIGNIN_ERROR:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};
