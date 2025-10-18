import express from "express";
import Stripe from "stripe";
import axios from "axios";
import Flutterwave from "flutterwave-node-v3";

const router = express.Router();

// 🔑 Load env keys
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);

// ✅ STRIPE Payment
router.post("/stripe-pay", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { name: "Mr. Kelly Coding Class Access" },
          unit_amount: 500 * 100, // $5
        },
        quantity: 1,
      }],
      success_url: `${process.env.BASE_URL}/lesson?paid=true`,
      cancel_url: `${process.env.BASE_URL}/cancel`,
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe Error:", err);
    res.status(500).json({ error: "Stripe payment failed" });
  }
});

// ✅ PAYSTACK Payment
router.post("/paystack-pay", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: req.body.email,
        amount: 500 * 100,
        callback_url: `${process.env.BASE_URL}/lesson?paid=true`,
      },
      { headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` } }
    );
    res.json({ url: response.data.data.authorization_url });
  } catch (err) {
    console.error("Paystack Error:", err);
    res.status(500).json({ error: "Paystack payment failed" });
  }
});

// ✅ FLUTTERWAVE Payment
router.post("/flutterwave-pay", async (req, res) => {
  try {
    const payload = {
      tx_ref: "TX-" + Date.now(),
      amount: "5",
      currency: "USD",
      redirect_url: `${process.env.BASE_URL}/lesson?paid=true`,
      customer: {
        email: req.body.email,
        name: req.body.name,
      },
      payment_options: "card, mobilemoney, ussd",
      customizations: {
        title: "Mr. Kelly Coding Class",
        description: "Access to coding lessons",
      },
    };
    const response = await flw.Payment.initialize(payload);
    res.json({ url: response.data.link });
  } catch (err) {
    console.error("Flutterwave Error:", err);
    res.status(500).json({ error: "Flutterwave payment failed" });
  }
});

export default router;
