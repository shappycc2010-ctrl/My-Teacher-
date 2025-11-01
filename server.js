import express from "express";
import multer from "multer";

const router = express.Router();

// Configure file uploads
const upload = multer({ dest: "uploads/" });

// Handle payment proof upload
router.post("/api/payment-proof", upload.single("proof"), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // In a real setup, you’d store proof in a database or email it to admin
  console.log(`Payment proof received: ${file.originalname}`);

  res.json({
    message:
      "✅ Thank you! Mr. Kelly has received your payment proof. He’ll verify it shortly and unlock your lessons.",
  });
});

export default router;
import paymentRouter from "./payment.js";
app.use("/", paymentRouter);
