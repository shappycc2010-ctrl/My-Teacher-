const memoryChatBtn = document.getElementById("memoryChatBtn");
const progressBtn   = document.getElementById("progressBtn");
const resetBtn      = document.getElementById("resetBtn");

// Memory chat (context-aware)
async function memoryChat() {
  const message = prompt("Ask Mr. Kelly something (he remembers your progress):");
  if (!message) return;

  addMessage("user", message);

  const res = await fetch("/api/chat-memory", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studentName, message }),
  });
  const data = await res.json();
  addMessage("ai", data.reply);
}

// View progress
async function viewProgress() {
  const res = await fetch(`/api/progress/${studentName}`);
  const data = await res.json();
  let text = `📘 Progress for ${studentName}\n\n`;
  if (data.quizzes?.length)
    data.quizzes.forEach((q) => {
      text += `• ${q.subject}: ${q.score}/5 (${new Date(q.date).toLocaleDateString()})\n`;
    });
  else text += "No quizzes yet.";
  addMessage("ai", text);
}

// Reset progress
async function resetProgress() {
  if (!confirm("Reset your progress?")) return;
  await fetch(`/api/progress/${studentName}`, { method: "DELETE" });
  addMessage("ai", "Progress reset ✅");
}

memoryChatBtn.addEventListener("click", memoryChat);
progressBtn.addEventListener("click", viewProgress);
resetBtn.addEventListener("click", resetProgress);
