import express from "express";
import {
  createProduct,
  getdatafromdatabase,
  updatedata,
  getproductbyid,
  getrelatedproducts,
  savedproducts,
  getonlysaveditems,
  unsaved,
  deleteProduct,
} from "../controllers/productcontroller.js";

import { verifyToken } from "../middleware/auth.js";
import { adminMiddleware } from "../controllers/admincontroller.js";

const router = express.Router();

router.get("/products", getdatafromdatabase);
router.get("/getsingleproductbyid/:id", getproductbyid);
router.get("/relatedproducts/:category/:id", getrelatedproducts);

router.post("/addproduct", adminMiddleware, createProduct);
router.put("/updatedata/:id", adminMiddleware, updatedata);

router.patch("/saveforlaterproductstodatabase/:id", verifyToken, savedproducts);
router.get(
  "/getsaveforlaterproductsfromdatabase",
  verifyToken,
  getonlysaveditems,
);
router.patch("/removesaveditems/:id", verifyToken, unsaved);
router.delete("/deleteproduct/:id", adminMiddleware, deleteProduct);
export default router;
