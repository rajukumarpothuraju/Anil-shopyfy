import express from "express";
import {
  placeOrder,
  getOrderById,
  getUserOrders,
  deleteOrder,
} from "../controllers/ordercontroller.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/place", verifyToken, placeOrder);

router.get("/get/:id", verifyToken, getOrderById);

router.get("/user-orders", verifyToken, getUserOrders);
router.delete("/delete/:id", verifyToken, deleteOrder);

export default router;
