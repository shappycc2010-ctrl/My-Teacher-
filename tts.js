import fetch from "node-fetch"; // Node 18+ has fetch; else npm package

router.post("/api/tts", async (req, res) => {
  try {
    const { text } = req.body;
    const key = process.env.ELEVENLABS_API_KEY;
    const voice = process.env.ELEVENLABS_VOICE_ID || "alloy";

    if (!key) return res.status(400).json({ error: "TTS api key missing" });

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`, {
      method: "POST",
      headers: {
        "xi-api-key": key,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text, voice })
    });

    if (!response.ok) {
      const txt = await response.text();
      console.error("TTS error", txt);
      return res.status(500).json({ error: "TTS provider error" });
    }

    const buffer = await response.arrayBuffer();
    res.setHeader("Content-Type", "audio/mpeg");
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error("TTS server error:", err);
    res.status(500).json({ error: "TTS failed" });
  }
});
