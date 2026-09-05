import jwt from "jsonwebtoken";
import User from "../models/User.js";

const sellerMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("role isSeller sellerProfile");

    if (!user) return res.status(401).json({ message: "User not found" });
    if (user.role !== "admin" && !user.isSeller) {
      return res.status(403).json({ message: "Seller access required" });
    }

    req.user = { ...decoded, isSeller: user.isSeller, sellerProfile: user.sellerProfile };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default sellerMiddleware;
