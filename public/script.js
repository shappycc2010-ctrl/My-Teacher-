const dashboard = document.getElementById("dashboard");
const classroom = document.getElementById("classroom");
const chatBox = document.getElementById("chatBox");
const messageInput = document.getElementById("messageInput");
const chatForm = document.getElementById("chatForm");
const subjectTitle = document.getElementById("subjectTitle");
const backBtn = document.getElementById("backBtn");

let currentSubject = "";
let studentName = "Student";

document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("click", () => {
    currentSubject = card.dataset.subject;
    subjectTitle.textContent = `📖 Now Learning: ${currentSubject}`;
    dashboard.classList.remove("active");
    classroom.classList.add("active");
    chatBox.innerHTML = "";
    addMessage("bot", `Hello! I'm Mr. Kelly, and I'll help you with ${currentSubject} today. What would you like to learn?`);
  });
});

backBtn.addEventListener("click", () => {
  classroom.classList.remove("active");
  dashboard.classList.add("active");
});

chatForm.addEventListener("submit", async e => {
  e.preventDefault();
  const message = messageInput.value.trim();
  if (!message) return;

  addMessage("user", message);
  messageInput.value = "";

  addMessage("bot", "✏️ Thinking...");

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, studentName })
    });
    const data = await res.json();
    chatBox.lastChild.remove(); // remove "Thinking..."
    addMessage("bot", data.reply);
  } catch (err) {
    chatBox.lastChild.remove();
    addMessage("bot", "⚠️ Sorry, something went wrong.");
  }
});

function addMessage(sender, text) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}
