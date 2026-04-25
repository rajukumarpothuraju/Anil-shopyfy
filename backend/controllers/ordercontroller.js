import Order from "../models/Ordermodel.js";
import Cart from "../models/Cartmodule.js";

export const placeOrder = async (req, res) => {
  try {
    const {
      items,
      amount,
      fullName,
      phoneNumber,
      address,
      city,
      pincode,
      paymentMethod,
      paymentStatus,
    } = req.body;
    const userId = req.user.id;

    const newOrder = new Order({
      userId,
      items,
      amount,
      address: { fullName, phoneNumber, address, city, pincode },
      paymentMethod,
      paymentStatus:
        paymentStatus || (paymentMethod === "cod" ? "Pending" : "Paid"),
    });

    const savedOrder = await newOrder.save();

    await Cart.deleteMany({ userId: userId });

    res.status(200).json({
      success: true,
      message: "Order Placed successfully! ",
      order: savedOrder,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Order error!" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const order = await Order.findOne({ _id: id, userId: userId });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found!" });
    }
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error!" });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ userId: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Fetch User Orders Error:", error);
    res.status(500).json({
      success: false,
      message: "order found error!",
    });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await Order.findOneAndDelete({ _id: id, userId: userId });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found or not yours!" });
    }

    res
      .status(200)
      .json({ success: true, message: "Order history deleted successfully !" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Delete error!" });
  }
};
