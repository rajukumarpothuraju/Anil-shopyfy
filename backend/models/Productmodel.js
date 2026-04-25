import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    imgUrl: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    category: {
      type: String,
      default: "general",
      enum: [
        "general",
        "electronics",
        "fashion",
        "home",
        "shirts",
        "pants",
        "womenswear",
        "menswear",
        "footwear",
        "bags",
        "fitness",
        "toys",
        "kidswear",
      ],
    },

    inStock: {
      type: Boolean,
      default: true,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 90,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    isSaved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// అనిల్, ఇక్కడ జాగ్రత్తగా గమనించు.
// ఒకవేళ "Product" మోడల్ ముందే ఉంటే దాన్నే వాడుకుంటుంది, లేకపోతే కొత్తది క్రియేట్ చేస్తుంది.
const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
