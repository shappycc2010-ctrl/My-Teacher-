
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import aiRoutes from "./routes/ai.js";
import paymentRoutes from "./routes/payment.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// --- MongoDB connect (optional) ---
if(process.env.MONGO_URI){
  mongoose.connect(process.env.MONGO_URI)
    .then(()=> console.log("✅ MongoDB connected"))
    .catch(err => console.log("MongoDB connection error:", err.message));
} else {
  console.log("⚠️ No MONGO_URI provided. DB features disabled.");
}

// Routes
app.use("/api/ai", aiRoutes);
app.use("/api/payment", paymentRoutes);

app.get("/", (req, res) => {
  res.send("My Teacher API - Mr. Kelly is awake.");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
