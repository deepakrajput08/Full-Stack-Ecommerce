import dotenv from "dotenv"
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import dns from "node:dns";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();
dotenv.config()

connectDB();


app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});