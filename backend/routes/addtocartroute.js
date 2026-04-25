import express from "express";
import {
  addtocart,
  getcartitem,
  deleteitem,
} from "../controllers/cartcontroller.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/add", verifyToken, addtocart);
router.get("/get", verifyToken, getcartitem);
router.delete("/delete/:id", verifyToken, deleteitem);

export default router;
