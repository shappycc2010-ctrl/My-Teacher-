// keepAlive.js
import fetch from "node-fetch";

const url = process.env.RENDER_EXTERNAL_URL; // your live site URL (Render sets this automatically)
const interval = 14 * 60 * 1000; // ping every 14 minutes

function keepAlive() {
  if (!url) {
    console.log("No Render URL found — skipping keep-alive ping");
    return;
  }
  setInterval(() => {
    fetch(url)
      .then(() => console.log("💓 Keep-alive ping sent to", url))
      .catch(err => console.error("Keep-alive ping failed:", err));
  }, interval);
}

keepAlive();
