
import express from "express";
const router = express.Router();

/*
  Simple account-to-account payment workflow (manual verification):
  - Client sends a "payment intent" with userId, plan, and payer details.
  - Admin checks bank/transfer outside platform, then marks payment as confirmed via admin panel (endpoint).
  - For starter template we store intents in memory. In production, save to DB.
*/

const intents = {};

router.post("/intent", (req,res) => {
  const { userId, plan, payerName, amount } = req.body;
  if(!userId || !plan || !amount) return res.status(400).json({ error: "userId, plan, amount required" });
  const id = Date.now().toString();
  intents[id] = { id, userId, plan, payerName, amount, status: "pending", createdAt: new Date().toISOString() };
  return res.json({ message: "Payment intent created. Please transfer funds to platform bank account and notify admin.", intent: intents[id] });
});

// Admin confirms payment (secure this in production)
router.post("/confirm", (req,res) => {
  const { intentId, adminKey } = req.body;
  if(adminKey !== process.env.ADMIN_KEY) return res.status(401).json({ error: "Unauthorized" });
  if(!intents[intentId]) return res.status(404).json({ error: "Intent not found" });
  intents[intentId].status = "confirmed";
  intents[intentId].confirmedAt = new Date().toISOString();
  return res.json({ message: "Payment confirmed", intent: intents[intentId] });
});

router.get("/intents", (req,res) => {
  res.json(Object.values(intents));
});

export default router;
