const API_BASE = "https://my-teacher-1.onrender.com";

const input = document.getElementById("input");
const chat = document.getElementById("chat");
const sendBtn = document.getElementById("sendBtn");
const submitBtn = document.getElementById("submitBtn");
const clearBtn = document.getElementById("clearBtn");
const studentNameInput = document.getElementById("studentName");
const modeSelect = document.getElementById("mode");
const statusDiv = document.getElementById("status");

// 🎤 Setup Speech Recognition
let recognition;
if ("webkitSpeechRecognition" in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.lang = "en-US";
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    input.value = transcript;
    sendMessage();
  };

  recognition.onerror = (e) => {
    statusDiv.textContent = "⚠️ Voice input error: " + e.error;
  };
} else {
  console.warn("Speech recognition not supported in this browser.");
}

// 🔊 Text-to-Speech
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = speechSynthesis
    .getVoices()
    .find((v) => v.name.includes("Google UK English Male")) || null;
  utterance.rate = 1.05;
  utterance.pitch = 1;
  speechSynthesis.speak(utterance);
}

// 🧩 Utility to add chat messages
function addMessage(sender, text) {
  const msg = document.createElement("div");
  msg.classList.add("msg", sender);
  msg.textContent = text;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

// 🧠 Send Message to Backend
async function sendMessage() {
  const studentName = studentNameInput.value.trim() || "Student";
  const message = input.value.trim();

  if (!message) return;

  addMessage("user", `${studentName}: ${message}`);
  input.value = "";
  statusDiv.textContent = "🤖 Thinking...";

  try {
    const response = await fetch(`${API_BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, studentName }),
    });

    const data = await response.json();
    const reply = data.reply || "Hmm... I’m not sure about that one!";
    addMessage("ai", `Mr. Kelly: ${reply}`);
    speak(reply);
    statusDiv.textContent = "✅ Ready";
  } catch (err) {
    console.error(err);
    statusDiv.textContent = "❌ Error connecting to Mr. Kelly";
  }
}

// 📘 Homework Submission Simulation
submitBtn.addEventListener("click", () => {
  const score = Math.floor(Math.random() * 40) + 60;
  const message = `Your homework has been submitted! Score: ${score}/100`;
  addMessage("ai", message);
  speak(message);
});

// 💬 Event Listeners
sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

clearBtn.addEventListener("click", () => {
  chat.innerHTML = "";
});

// 🎤 Long-press Send button to activate voice input
sendBtn.addEventListener("mousedown", () => {
  if (recognition) {
    statusDiv.textContent = "🎙️ Listening...";
    recognition.start();
  }
});
sendBtn.addEventListener("mouseup", () => {
  if (recognition) {
    recognition.stop();
    statusDiv.textContent = "✅ Ready";
  }
});
