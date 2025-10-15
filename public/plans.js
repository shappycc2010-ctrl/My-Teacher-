// inside ai.js or a new file plans.js imported by server.js
import express from "express";
import OpenAI from "openai";
import fs from "fs";
const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const PLANS_FILE = "./plans.json";
function loadPlans() {
  if (!fs.existsSync(PLANS_FILE)) return {};
  try { return JSON.parse(fs.readFileSync(PLANS_FILE, "utf8")); } catch { return {}; }
}
function savePlans(plans) { fs.writeFileSync(PLANS_FILE, JSON.stringify(plans, null, 2)); }

// Create a study plan
router.post("/api/plan/create", async (req, res) => {
  try {
    const { studentName, subject, durationWeeks = 4, level = "beginner", goals = "" } = req.body;
    const prompt = `Create a ${durationWeeks}-week study plan for a ${level} student on the subject "${subject}". 
Include weekly topics, 3 suggested exercises per week, expected learning outcome per week, and 1 quiz theme at the end.
Keep output JSON-friendly (week number, topics[], exercises[], outcome, quiz). StudentName: ${studentName}. Goals: ${goals}.`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are Mr. Kelly, a careful curriculum designer. Output valid JSON only." },
        { role: "user", content: prompt }
      ],
      temperature: 0.2
    });

    const text = completion.choices[0].message.content;

    // Attempt to parse JSON — fall back to saving raw text
    let planObj;
    try {
      planObj = JSON.parse(text);
    } catch (err) {
      // If model gives text, wrap it
      planObj = { raw: text };
    }

    const plans = loadPlans();
    plans[studentName] = plans[studentName] || [];
    const record = { id: Date.now(), subject, level, durationWeeks, goals, createdAt: new Date().toISOString(), plan: planObj };
    plans[studentName].push(record);
    savePlans(plans);

    res.json({ success: true, plan: record });
  } catch (err) {
    console.error("Plan creation error:", err);
    res.status(500).json({ error: "Failed to create plan" });
  }
});

// Get student's plans
router.get("/api/plan/:studentName", (req, res) => {
  const plans = loadPlans();
  res.json(plans[req.params.studentName] || []);
});

export default router;
