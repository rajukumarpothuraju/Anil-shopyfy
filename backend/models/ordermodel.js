import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userdetails",
      required: true,
    },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: {
      fullName: String,
      phoneNumber: String,
      address: String,
      city: String,
      pincode: String,
    },
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: String, default: "Pending" },
    orderStatus: { type: String, default: "processing" },
  },
  { timestamps: true },
);

export default mongoose.model("Order", orderSchema);
