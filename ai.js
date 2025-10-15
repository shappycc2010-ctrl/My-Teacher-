router.post("/api/chat", async (req, res) => {
  try {
    const { message, studentName, mode } = req.body;
    const modePrompts = {
      math: "You are Mr. Kelly, a helpful math tutor. Explain step-by-step and include examples when helpful.",
      science: "You are Mr. Kelly, a science tutor. Use clear analogies and be precise.",
      english: "You are Mr. Kelly, an English tutor. Focus on grammar and clear examples.",
      history: "You are Mr. Kelly, a history tutor. Provide dates, context, and clear explanations.",
      general: "You are Mr. Kelly, a friendly AI teacher who helps students learn web development and general tech topics."
    };
    const system = modePrompts[mode] || modePrompts.general;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: `${studentName}: ${message}` }
      ]
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI error" });
  }
});
