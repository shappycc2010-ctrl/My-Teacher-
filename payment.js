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
import express from "express";
import fetch from "node-fetch";

const router = express.Router();

// ✅ Create subscription (Tonkeeper / NOWPayments)
router.get("/subscribe", async (req, res) => {
  try {
    const response = await fetch("https://api.nowpayments.io/v1/payment", {
      method: "POST",
      headers: {
        "x-api-key": process.env.NOWPAYMENTS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price_amount: 10, // lesson price in USD
        price_currency: "usd",
        pay_currency: "ton", // payment in TON
        order_description: "Mr. Kelly Coding Class Subscription",
        success_url: "https://my-teacher-1.onrender.com/success",
        cancel_url: "https://my-teacher-1.onrender.com/cancel",
      }),
    });

    const data = await response.json();

    if (data.invoice_url) {
      // Redirect user to payment page
      res.redirect(data.invoice_url);
    } else {
      res.status(500).send("Payment creation failed.");
    }
  } catch (err) {
    console.error("Payment error:", err);
    res.status(500).send("Error creating payment.");
  }
});

export default router;
