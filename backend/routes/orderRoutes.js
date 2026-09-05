import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import userAuthMiddleware from "../middleware/userAuthMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", userAuthMiddleware, async (req, res) => {
  try {
    const { items, shippingAddress, totalAmount } = req.body;
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: "Order must contain at least one product" });

    const order = await Order.create({ user: req.user.id, items, shippingAddress, totalAmount });
    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to create order" });
  }
});

router.get("/my-orders", userAuthMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate("items.product", "name image seller").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

router.get("/all", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "username email").populate("items.product", "name seller").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch all orders" });
  }
});

router.get("/seller", userAuthMiddleware, async (req, res) => {
  try {
    if (!req.user.isSeller && req.user.role !== "admin") return res.status(403).json({ message: "Seller access required" });
    const sellerProducts = await Product.find({ seller: req.user.id }).select("_id");
    const productIds = sellerProducts.map((p) => p._id);
    const orders = await Order.find({ "items.product": { $in: productIds } })
      .populate("user", "username email")
      .populate("items.product", "name image seller")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch seller orders" });
  }
});

router.put("/:id/status", authMiddleware, async (req, res) => {
  try {
    const allowedStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
    if (!allowedStatuses.includes(req.body.status)) return res.status(400).json({ message: "Invalid order status" });
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order status updated successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status" });
  }
});

router.put("/seller/:id/status", userAuthMiddleware, async (req, res) => {
  try {
    if (!req.user.isSeller) return res.status(403).json({ message: "Seller access required" });
    const allowedStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
    if (!allowedStatuses.includes(req.body.status)) return res.status(400).json({ message: "Invalid order status" });

    const products = await Product.find({ seller: req.user.id }).select("_id");
    const ids = products.map((p) => String(p._id));
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (!order.items.some((item) => ids.includes(String(item.product)))) {
      return res.status(403).json({ message: "You can only manage orders containing your products" });
    }

    order.status = req.body.status;
    await order.save();
    res.json({ message: "Order status updated successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to update seller order status" });
  }
});

export default router;
