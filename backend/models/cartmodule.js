import mongoose from "mongoose";

const cartschema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userdetails",
      required: true,
    },
    productid: { type: String, required: true },
    producttitle: { type: String, required: true },
    productprice: { type: Number, required: true },
    productdescription: { type: String, required: true },
    productimage: { type: String, required: true },
    productrating: { type: Number, required: true },
    quantity: { type: Number, default: 1 },
    isSaved: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model("Cart", cartschema);
