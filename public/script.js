const chatBox = document.getElementById("chat-box");
const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  addMessage("You", message, "user");
  userInput.value = "";

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, studentName: "Student" })
  });

  const data = await res.json();
  addMessage("Mr. Kelly", data.reply, "ai");
}

function addMessage(sender, text, cls) {
  const msg = document.createElement("div");
  msg.classList.add("message", cls);
  msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
                         }
