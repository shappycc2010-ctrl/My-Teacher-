import express from "express";
import OpenAI from "openai";

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/api/chat", async (req, res) => {
  try {
    const { message, studentName } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are Mr. Kelly, a friendly AI teacher." },
        { role: "user", content: `${studentName}: ${message}` }
      ]
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error("AI error:", err);
    res.status(500).json({ error: "Something went wrong with Mr. Kelly." });
  }
});

export default router;
