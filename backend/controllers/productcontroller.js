import Product from "../models/Productmodel.js";
import Cart from "../models/Cartmodule.js";

// 1. Create Product
export const createProduct = async (req, res) => {
  try {
    const { title, price, imgUrl, description, category } = req.body;
    const newProduct = await Product.create({
      title,
      price,
      imgUrl,
      description,
      category,
    });
    return res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "error occured",
      error: error.message,
    });
  }
};

// 2. Get All Products
export const getdatafromdatabase = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Database fetch error",
      error: error.message,
    });
  }
};

// 3. Update Product
export const updatedata = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const product = await Product.findByIdAndUpdate(id, update, {
      // new: true,
      returnDocument: "after",
      runValidators: true,
    });
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "product not found" });
    res.status(200).json({
      success: true,
      message: "product update sucessfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 4. Get Single Product
export const getproductbyid = async (req, res) => {
  try {
    const foundProduct = await Product.findById(req.params.id);
    if (!foundProduct)
      return res.status(404).json({ message: "Product not found!" });
    res.status(200).json(foundProduct);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching product", error: error.message });
  }
};

// 5. Get Related Products
export const getrelatedproducts = async (req, res) => {
  try {
    const { category, id } = req.params;
    const related = await Product.find({
      category: category,
      _id: { $ne: id },
    }).limit(20);
    res.status(200).json(related);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Related products error", error: error.message });
  }
};

// 6. Save/Unsave Products
export const savedproducts = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "User cannot login!" });
    const found = await Cart.findOne({ _id: req.params.id, userId: userId });
    if (!found)
      return res.status(404).json({ message: "Cart item not found!" });
    found.isSaved = !found.isSaved;
    await found.save();
    res.status(200).json({
      success: true,
      message: found.isSaved ? "Saved" : "Moved to cart",
      data: found,
    });
  } catch (error) {
    res.status(400).json({ message: "Error", error: error.message });
  }
};

// 7. Get Saved Items
export const getonlysaveditems = async (req, res) => {
  try {
    const items = await Cart.find({ userId: req.user.id, isSaved: true });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "error", error: error.message });
  }
};

// 8. Unsave Item
export const unsaved = async (req, res) => {
  try {
    const item = await Cart.findById(req.params.id);
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Item not found!" });
    item.isSaved = false;
    await item.save();
    res.status(200).json({ success: true, message: "Removed!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }
    res.status(200).json({
      success: true,
      message: "Product delete perminantly!",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Delete error", error: error.message });
  }
};
