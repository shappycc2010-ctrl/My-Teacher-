const chatBox = document.getElementById("chatBox");
const messageInput = document.getElementById("messageInput");
const chatForm = document.getElementById("chatForm");

let studentName = null;
let greeted = false;

window.addEventListener("load", () => {
  startClass();
});

function startClass() {
  const time = new Date().getHours();
  let greeting = "Good day";
  if (time < 12) greeting = "Good morning";
  else if (time < 17) greeting = "Good afternoon";
  else greeting = "Good evening";

  addMessage("bot", `👋 ${greeting}! Welcome back to Mr. Kelly’s Coding Class.`);
  setTimeout(() => {
    addMessage(
      "bot",
      "Today, we’ll be continuing from where we stopped last class. You all did great with your homework, but there’s still room for improvement. 💪"
    );
  }, 1200);
  setTimeout(() => {
    addMessage("bot", "Before we start, may I know your name?");
  }, 2500);
}

chatForm.addEventListener("submit", async e => {
  e.preventDefault();
  const message = messageInput.value.trim();
  if (!message) return;

  addMessage("user", message);
  messageInput.value = "";

  if (!studentName) {
    studentName = message;
    greeted = true;
    addMessage(
      "bot",
      `Nice to meet you, ${studentName}! 👨‍🏫 Let’s dive into today’s coding lesson.`
    );
    setTimeout(() => {
      addMessage(
        "bot",
        "Remember: coding is all about practice and patience. What would you like to work on today — JavaScript, HTML, or something else?"
      );
    }, 1200);
    return;
  }

  addMessage("bot", "💭 Let me think...");
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `Student: ${studentName} asked: ${message}`,
        studentName,
      }),
    });
    const data = await res.json();
    chatBox.lastChild.remove(); // remove "thinking" message
    addMessage("bot", data.reply);
  } catch (err) {
    chatBox.lastChild.remove();
    addMessage("bot", "⚠️ Sorry, something went wrong while processing your question.");
  }
});

function addMessage(sender, text) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
                          }
