import express from "express";
import {
  createOrder,
  verifyPayment,
} from "../controllers/paymentcontroller.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/order", verifyToken, createOrder);
router.post("/verify", verifyToken, verifyPayment);

export default router;
