
import express from "express";
import OpenAI from "openai";

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Simple chat endpoint calling gpt-4o-mini (or model set via env OPENAI_MODEL)
router.post("/chat", async (req, res) => {
  try {
    const { message, studentName } = req.body;
    if(!message) return res.status(400).json({ error: "Message required" });
    const systemPrompt = `You are Mr. Kelly, a friendly, encouraging AI teacher for web development. Never provide direct answers to homework until student has submitted. Keep tone warm and supportive.`;
    const userContent = (studentName ? studentName + " asks: " : "") + message;

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent }
      ],
      max_tokens: 800
    });

    const reply = response.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";
    res.json({ reply });
  } catch (err) {
    console.error("AI error:", err.message || err);
    res.status(500).json({ error: err.message || String(err) });
  }
});

export default router;
