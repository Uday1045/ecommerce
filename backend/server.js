import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";

import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// ✅ CORS Configuration
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://ecommerce-1-gmxz.onrender.com" // ✅ Replace with your actual frontend domain
  ],
  credentials: true,
}));

// ✅ Middleware
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);

// ✅ Serve Frontend in Production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/frontend/dist/index.html"));
  });
}

// ✅ Connect to DB then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    if (process.env.NODE_ENV === "production") {
      console.log(`✅ Server running on port ${PORT} in PRODUCTION`);
    } else {
      console.log(`✅ Server running locally at http://localhost:${PORT}`);
    }
    console.log("MONGO_URI value:", process.env.MONGO_URI);
  });
}).catch((err) => {
  console.error("❌ Failed to connect to MongoDB:", err);
});
