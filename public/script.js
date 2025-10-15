const chatBox = document.getElementById("chatBox");
const sendBtn = document.getElementById("sendBtn");
const messageInput = document.getElementById("messageInput");
const studentName = document.getElementById("studentName");
const topicInput = document.getElementById("topic");
const modeSelect = document.getElementById("mode");
const voiceBtn = document.getElementById("voiceBtn");

function appendMessage(sender, text) {
  const div = document.createElement("div");
  div.classList.add("message", sender);
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const message = messageInput.value.trim();
  const name = studentName.value || "Student";
  const topic = topicInput.value;
  const mode = modeSelect.value;

  if (!message) return;

  appendMessage("user", `${name}: ${message}`);
  messageInput.value = "";

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, studentName: name, topic, mode }),
  });

  const data = await res.json();
  appendMessage("ai", "Mr Kelly: " + data.reply);
  speak(data.reply);
}

sendBtn.onclick = sendMessage;
messageInput.addEventListener("keypress", e => e.key === "Enter" && sendMessage());

// voice input
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
voiceBtn.onclick = () => {
  recognition.start();
  voiceBtn.textContent = "🎙️ Listening...";
};
recognition.onresult = e => {
  const transcript = e.results[0][0].transcript;
  messageInput.value = transcript;
  voiceBtn.textContent = "🎤";
};

// speech output
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  speechSynthesis.speak(utterance);
    }
