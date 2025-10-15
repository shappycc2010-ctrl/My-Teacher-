const API_BASE = "https://my-teacher-1.onrender.com";

const input = document.getElementById("input");
const chat = document.getElementById("chat");
const sendBtn = document.getElementById("sendBtn");
const submitBtn = document.getElementById("submitBtn");
const clearBtn = document.getElementById("clearBtn");
const studentNameInput = document.getElementById("studentName");
const modeSelect = document.getElementById("mode");
const statusDiv = document.getElementById("status");
const classBody = document.getElementById("classBody");

let students = {};

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
}

// 🔊 Text-to-Speech
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice =
    speechSynthesis
      .getVoices()
      .find((v) => v.name.includes("Google UK English Male")) || null;
  utterance.rate = 1.05;
  utterance.pitch = 1;
  speechSynthesis.speak(utterance);
}

// 🧩 Add Chat Messages
function addMessage(sender, text) {
  const msg = document.createElement("div");
  msg.classList.add("msg", sender);
  msg.textContent = text;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

// 📊 Update Dashboard
function updateDashboard(name, score = null) {
  if (!students[name]) {
    students[name] = { messages: 0, scores: [], lastSeen: new Date() };
  }
  students[name].messages++;
  students[name].lastSeen = new Date();
  if (score !== null) students[name].scores.push(score);

  const avg =
    students[name].scores.length > 0
      ? (
          students[name].scores.reduce((a, b) => a + b, 0) /
          students[name].scores.length
        ).toFixed(1)
      : "—";

  // Render dashboard table
  classBody.innerHTML = Object.entries(students)
    .map(
      ([n, s]) => `
      <tr>
        <td class="p-2 font-medium">${n}</td>
        <td class="p-2">${s.messages}</td>
        <td class="p-2">${avg}</td>
        <td class="p-2">${s.lastSeen.toLocaleTimeString()}</td>
      </tr>`
    )
    .join("");
}

// 🧠 Send Message to AI
async function sendMessage() {
  const studentName = studentNameInput.value.trim() || "Student";
  const message = input.value.trim();

  if (!message) return;

  addMessage("user", `${studentName}: ${message}`);
  updateDashboard(studentName);
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
    statusDiv.textContent = "❌ Connection error";
  }
}

// 📘 Simulate Homework Submission
submitBtn.addEventListener("click", () => {
  const studentName = studentNameInput.value.trim() || "Student";
  const score = Math.floor(Math.random() * 40) + 60;
  const message = `Your homework has been submitted! Score: ${score}/100`;
  addMessage("ai", message);
  speak(message);
  updateDashboard(studentName, score);
});

// 💬 Chat Events
sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
clearBtn.addEventListener("click", () => (chat.innerHTML = ""));

// 🎤 Long press send button for voice input
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
