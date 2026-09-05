import express from "express";
import Product from "../models/Product.js";
import sellerMiddleware from "../middleware/sellerMiddleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("seller", "username sellerProfile");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("seller", "username sellerProfile");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product", error: error.message });
  }
});

router.post("/", sellerMiddleware, async (req, res) => {
  try {
    const { name, price, image, description, category, stock } = req.body;
    if (!name || price === undefined || !image || !description || !category) {
      return res.status(400).json({ message: "All product fields are required" });
    }

    const product = await Product.create({
      name, price: Number(price), image, description, category, stock: Number(stock ?? 0),
      seller: req.user.role === "admin" ? null : req.user.id,
    });
    await product.populate("seller", "username sellerProfile");
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to add product", error: error.message });
  }
});

router.put("/:id", sellerMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (req.user.role !== "admin" && String(product.seller) !== String(req.user.id)) {
      return res.status(403).json({ message: "You can only edit your own products" });
    }

    const updates = { ...req.body };
    delete updates.seller;
    if (updates.price !== undefined) updates.price = Number(updates.price);
    if (updates.stock !== undefined) updates.stock = Number(updates.stock);

    const updated = await Product.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })
      .populate("seller", "username sellerProfile");
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update product", error: error.message });
  }
});

router.delete("/:id", sellerMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (req.user.role !== "admin" && String(product.seller) !== String(req.user.id)) {
      return res.status(403).json({ message: "You can only delete your own products" });
    }

    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product", error: error.message });
  }
});

export default router;
