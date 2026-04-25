import dotEnv from "dotenv";
dotEnv.config();
import express from "express";
import cors from "cors";
// deploy fix
import mongoose from "mongoose";
import homeroutes from "./routes/homeroutes.js";
import productpageroutes from "./routes/productpageroutes.js";
import addtocartroute from "./routes/addtocartroute.js";
import userauthroutes from "./routes/userauthroutes.js";
import orderRoutes from "./routes/order-routes.js";
import paymentRoutes from "./routes/payment-routes.js";
import aiRoute from "./routes/airoute.js";
const port = 5000;
const app = express();

app.use(cors());

app.use(express.json());

app.use("/images", express.static("images"));

app.use("/api", homeroutes);

app.use("/api", productpageroutes);

app.use("/apicart", addtocartroute);
app.use("/api", userauthroutes);
app.use("/api/order", orderRoutes);
app.use("/api/payment", paymentRoutes);

app.use("/api/ai", aiRoute);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("database connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });
// Build trigger fix: routing case update
// server start

app.listen(port, () => {
  console.log("server started successfully on port", port);
});
