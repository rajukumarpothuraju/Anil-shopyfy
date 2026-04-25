import userdetails from "../models/Userauthmodal.js";
import Order from "../models/ordermodel.js";
import Product from "../models/productmodel.js";
import Cart from "../models/cartmodule.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

export const adminMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token, access denied!" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "anil_secret_key",
    );

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied! Admin only." });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token!" });
  }
};

// --- 2. ADMIN LOGIN ---
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userdetails.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Admin account not found!" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "this is not admin account!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "incorrect password!" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "anil_secret_key",
      { expiresIn: "1d" },
    );

    res.status(200).json({
      success: true,
      token,
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error!", error: error.message });
  }
};

// --- 3. USER MANAGEMENT ---
export const getAllUsers = async (req, res) => {
  try {
    const users = await userdetails.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Users data error!" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await userdetails.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "User removed!" });
  } catch (error) {
    res.status(500).json({ message: "User delete failed!" });
  }
};

// --- 4. ORDER MANAGEMENT (ADMIN) ---
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "username email mobile")
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Orders data error!" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { orderStatus: status },
      { new: true },
    );
    res.status(200).json({
      success: true,
      message: `Status updated to ${status}`,
      data: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({ message: "Update failed!" });
  }
};

// --- 5. PRODUCT MANAGEMENT ---
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Product deleted!" });
  } catch (error) {
    res.status(500).json({ message: "Product delete error!" });
  }
};

// --- 6. USER SIDE ORDER ACTIONS ---
export const placeOrder = async (req, res) => {
  try {
    const {
      items,
      amount,
      fullName,
      phoneNumber,
      address,
      city,
      pincode,
      paymentMethod,
      paymentStatus,
    } = req.body;
    const userId = req.user.id;

    const newOrder = new Order({
      userId,
      items,
      amount,
      address: { fullName, phoneNumber, address, city, pincode },
      paymentMethod,
      paymentStatus:
        paymentStatus || (paymentMethod === "cod" ? "Pending" : "Paid"),
    });

    const savedOrder = await newOrder.save();
    await Cart.deleteMany({ userId: userId });

    res
      .status(200)
      .json({ success: true, message: "Order Placed! ", order: savedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: "Order error!" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const order = await Order.findOne({ _id: id, userId: userId });
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found!" });
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error!" });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ userId: userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error!" });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const order = await Order.findOneAndDelete({ _id: id, userId: userId });
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found!" });
    res
      .status(200)
      .json({ success: true, message: "Order history deleted! 🗑️" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Delete error!" });
  }
};

// --- 7. RAZORPAY (FIXED KEY CHECK) ---
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_SfwdAHWTfeL52v",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "knjo4VUccKRewU8AU33L4PLE",
});

export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Order failed", error });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET || "knjo4VUccKRewU8AU33L4PLE",
      )
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      return res.status(200).json({ message: "Payment Success " });
    } else {
      return res.status(400).json({ message: "Invalid Signature " });
    }
  } catch (error) {
    res.status(500).json({ message: "Verification failed" });
  }
};
