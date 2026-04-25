import Cart from "../models/Cartmodule.js";
import mongoose from "mongoose";

export const addtocart = async (req, res) => {
  try {
    const { productid } = req.body;
    const userId = req.user.id;

    let cartItem = await Cart.findOne({ productid, userId });

    if (cartItem) {
      // Increment quantity
      cartItem.quantity += 1;
      const updatedItem = await cartItem.save();
      res.status(200).json({ message: "Quantity updated", data: updatedItem });
    } else {
      const newcartitem = new Cart({
        ...req.body,
        userId: userId,
      });
      const saveditem = await newcartitem.save();
      res
        .status(200)
        .json({ message: "Item added to your cart", data: saveditem });
    }
  } catch (err) {
    console.log("Add to cart error:", err);
    res.status(500).json({ error: "Failed to add item to cart" });
  }
};

export const getcartitem = async (req, res) => {
  try {
    const userId = req.user.id;

    const items = await Cart.find({ userId });

    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: "Data not get!" });
  }
};

export const deleteitem = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid cart item ID format" });
  }

  try {
    const deleteproduct = await Cart.findOneAndDelete({
      _id: id,
      userId: userId,
    });

    if (!deleteproduct) {
      return res.status(404).json({ message: "Cart item not found!" });
    }
    res.status(200).json({ message: "Product successfully deleted " });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
