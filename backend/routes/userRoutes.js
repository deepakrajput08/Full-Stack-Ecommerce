import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userAuthMiddleware from "../middleware/userAuthMiddleware.js";

const router = express.Router();

const publicUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  role: user.role,
  isSeller: user.isSeller,
  sellerProfile: user.sellerProfile,
});

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) return res.status(400).json({ message: "Username or email already exists" });

    const user = await User.create({ username, email, password });
    res.status(201).json({ message: "Account created successfully", user: publicUser(user) });
  } catch (error) {
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Username and password are required" });

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "Invalid username or password" });

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) return res.status(401).json({ message: "Invalid username or password" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ message: "Login successful", token, user: { ...publicUser(user), token } });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

router.post("/become-seller", userAuthMiddleware, async (req, res) => {
  try {
    if (req.user.role === "admin") {
      return res.status(400).json({ message: "Admin accounts do not need a seller account" });
    }

    const { storeName, description = "" } = req.body;
    if (!storeName?.trim()) return res.status(400).json({ message: "Store name is required" });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { isSeller: true, sellerProfile: { storeName: storeName.trim(), description: description.trim() } },
      { new: true, runValidators: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Seller account created successfully", user: publicUser(user) });
  } catch (error) {
    res.status(500).json({ message: "Could not create seller account", error: error.message });
  }
});

export default router;
