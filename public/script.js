const chatBox = document.getElementById("chatBox");
const messageInput = document.getElementById("messageInput");
const chatForm = document.getElementById("chatForm");

let studentName = localStorage.getItem("studentName") || null;
let lastTopic = localStorage.getItem("lastTopic") || null;

// ✅ Start class when the page loads
window.addEventListener("load", startClass);

function startClass() {
  const time = new Date().getHours();
  let greeting = "Good day";
  if (time < 12) greeting = "Good morning";
  else if (time < 17) greeting = "Good afternoon";
  else greeting = "Good evening";

  if (studentName) {
    addMessage("bot", `👋 ${greeting}, ${studentName}! Welcome back to Mr. Kelly’s Coding Class.`);
    if (lastTopic) {
      addMessage(
        "bot",
        `Last time, we stopped at *${lastTopic}*. Let’s pick up from there today. 🧠💻`
      );
    } else {
      addMessage(
        "bot",
        "We’ll be continuing from our previous coding lesson. I’m proud of your progress so far! 💪"
      );
    }
    setTimeout(() => {
      addMessage("bot", "So, what topic would you like to explore or review today?");
    }, 1500);
  } else {
    addMessage("bot", `👋 ${greeting}! Welcome to Mr. Kelly’s Coding Class.`);
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
}

// ✅ Chat logic
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = messageInput.value.trim();
  if (!message) return;

  addMessage("user", message);
  messageInput.value = "";

  // Ask for name if not set
  if (!studentName) {
    studentName = message;
    localStorage.setItem("studentName", studentName);
    addMessage("bot", `Nice to meet you, ${studentName}! 👨‍🏫`);
    setTimeout(() => {
      addMessage(
        "bot",
        "Let’s begin today’s coding class! Which topic shall we start with — JavaScript, HTML, or CSS?"
      );
    }, 1000);
    return;
  }

  // When student chooses a topic, store it
  if (message.toLowerCase().includes("javascript") ||
      message.toLowerCase().includes("html") ||
      message.toLowerCase().includes("css")) {
    lastTopic = message;
    localStorage.setItem("lastTopic", lastTopic);
    addMessage("bot", `Excellent choice! Let's dive into ${lastTopic} today. 🚀`);
  }

  // Send message to backend
  addMessage("bot", "💭 Let me think...");
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `Student ${studentName} said: ${message}`,
        studentName,
      }),
    });
    const data = await res.json();
    chatBox.lastChild.remove(); // remove "thinking" message
    addMessage("bot", data.reply);
  } catch (err) {
    chatBox.lastChild.remove();
    addMessage("bot", "⚠️ Sorry, something went wrong. Try again later.");
  }
});

// ✅ Helper function to display messages
function addMessage(sender, text) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.innerHTML = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}
