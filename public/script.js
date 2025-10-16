const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const nameInput = document.getElementById("student-name");
const topicInput = document.getElementById("lesson-topic");
const modeSelect = document.getElementById("mode-select");

// Function to append messages
function addMessage(sender, text, color = "lightblue") {
  const messageDiv = document.createElement("div");
  messageDiv.textContent = `${sender}: ${text}`;
  messageDiv.style.background = color;
  messageDiv.style.margin = "8px";
  messageDiv.style.padding = "8px";
  messageDiv.style.borderRadius = "8px";
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to send message to backend
async function sendMessage() {
  const message = input.value.trim();
  const studentName = nameInput.value.trim() || "Student";
  const mode = modeSelect.value;

  if (!message) return;

  addMessage(studentName, message, "#d6f4ff");
  input.value = "";

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, studentName, mode }),
    });

    const data = await response.json();

    if (data.reply) {
      addMessage("Mr. Kelly 👨‍🏫", data.reply, "#e8ffe8");
    } else {
      addMessage("Mr. Kelly 👨‍🏫", "I didn’t quite get that, please try again.", "#ffe8e8");
    }
  } catch (error) {
    addMessage("System ⚠️", "Connection issue. Please check your server.", "#ffdddd");
  }
}

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
