const API_BASE = "https://my-teacher-1.onrender.com"; // ✅ Your deployed backend URL

// UI elements
const chatEl = document.getElementById("chat");
const inputEl = document.getElementById("input");
const sendBtn = document.getElementById("sendBtn");
const submitBtn = document.getElementById("submitBtn");
const clearBtn = document.getElementById("clearBtn");
const nameEl = document.getElementById("studentName");
const modeEl = document.getElementById("mode");
const statusEl = document.getElementById("status");

// Store chat history locally
let history = JSON.parse(localStorage.getItem("chatHistory") || "[]");

// --- Display old messages if any
window.onload = () => {
  chatEl.innerHTML = "";
  history.forEach(msg => addMessage(msg.sender, msg.text, msg.name));
};

// --- Helper to push messages to UI
function addMessage(sender, text, name) {
  const div = document.createElement("div");
  div.className = sender === "me" ? "msg user" : "msg ai";
  const senderName = sender === "me" ? name : "Mr. Kelly";
  div.innerHTML = `<strong>${senderName}:</strong> ${text}`;
  chatEl.appendChild(div);
  chatEl.scrollTop = chatEl.scrollHeight;

  history.push({ sender, text, name });
  localStorage.setItem("chatHistory", JSON.stringify(history));
}

// --- Typing indicator
function showTyping() {
  const typing = document.createElement("div");
  typing.id = "typing";
  typing.className = "msg ai";
  typing.textContent = "Mr. Kelly is typing...";
  chatEl.appendChild(typing);
  chatEl.scrollTop = chatEl.scrollHeight;
}

function hideTyping() {
  const typing = document.getElementById("typing");
  if (typing) typing.remove();
}

// --- Update progress stats
function updateStats() {
  const scores = history
    .filter(h => h.sender === "ai" && h.text.match(/\b\d+\/10\b/))
    .map(h => parseInt(h.text.match(/\b\d+/)?.[0]));
  if (scores.length > 0) {
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    localStorage.setItem("avgScore", avg.toFixed(1));
    statusEl.textContent = `📊 Avg Score: ${avg.toFixed(1)}/10`;
  }
}

// --- Send message (regular chat or homework answer)
async function sendMessage() {
  const message = inputEl.value.trim();
  if (!message) return;

  const studentName = nameEl.value.trim() || "Student";
  const mode = modeEl.value;

  addMessage("me", message, studentName);
  inputEl.value = "";
  statusEl.textContent = "Thinking...";
  showTyping();

  try {
    const res = await fetch(API_BASE + "/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, studentName, mode })
    });

    hideTyping();

    if (!res.ok) throw new Error("Network response was not ok");

    const data = await res.json();
    addMessage("ai", data.reply, "Mr. Kelly");
    updateStats();
    statusEl.textContent = "✅ Ready";
  } catch (err) {
    hideTyping();
    addMessage("ai", "⚠️ There was an error contacting Mr. Kelly.", "System");
    console.error(err);
    statusEl.textContent = "Error";
  }
}

// --- Submit homework for grading
async function submitHomework() {
  const studentName = nameEl.value.trim() || "Student";
  const mode = "homework";

  addMessage("me", "[Submitting homework...]", studentName);
  statusEl.textContent = "Grading your homework...";
  showTyping();

  try {
    const res = await fetch(API_BASE + "/api/chat", {
      method: "POST",
      headers: { "Content-Type":
