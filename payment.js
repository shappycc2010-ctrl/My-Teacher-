import express from "express";
import fetch from "node-fetch";

const router = express.Router();

// ✅ Create a payment
router.post("/api/create-payment", async (req, res) => {
  try {
    const response = await fetch("https://api.nowpayments.io/v1/payment", {
      method: "POST",
      headers: {
        "x-api-key": process.env.NOWPAYMENTS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price_amount: 10, // amount in USD or other currency
        price_currency: "usd",
        pay_currency: "ton", // students will pay with TON via Tonkeeper
        order_description: "Mr. Kelly Coding Class Subscription",
      }),
    });

    const data = await response.json();
    res.json({ paymentUrl: data.invoice_url });
  } catch (err) {
    console.error("Payment Error:", err);
    res.status(500).json({ error: "Payment creation failed" });
  }
});

export default router;
