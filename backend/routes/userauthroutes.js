import express from "express";
import {
  signup,
  verifyotp,
  resendotp,
  signin,
} from "../controllers/userauthcontroller.js";
import {
  getAllUsers,
  getAllOrders,
  updateOrderStatus,
  deleteUser,
} from "../controllers/admincontroller.js";
import { adminMiddleware } from "../controllers/admincontroller.js";
import { adminLogin } from "../controllers/admincontroller.js";

const router = express.Router();
router.post("/signup", signup);
router.post("/verify-otp", verifyotp);
router.post("/resend-otp", resendotp);
router.post("/signin", signin);
router.post("/auth/admin-login", adminLogin);
router.get("/admin/users", adminMiddleware, getAllUsers);
router.get("/admin/orders", adminMiddleware, getAllOrders);
router.patch("/admin/order-status/:id", adminMiddleware, updateOrderStatus);
router.delete("/admin/user/:id", adminMiddleware, deleteUser);
export default router;
