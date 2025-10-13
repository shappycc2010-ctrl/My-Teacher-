router.get("/api/test-key", (req, res) => {
  if (process.env.OPENAI_API_KEY) {
    res.send("✅ OpenAI key detected on server.");
  } else {
    res.send("❌ OpenAI key missing on server.");
  }
});
