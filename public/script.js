const chatBox = document.getElementById("chatBox");
const messageInput = document.getElementById("messageInput");
const chatForm = document.getElementById("chatForm");

let studentName = "Student";
let currentSubject = null;

const subjects = ["Math", "Science", "Web Development", "History", "English"];

// Mr. Kelly introduces himself
window.addEventListener("load", () => {
  addMessage("bot", "👋 Hello! I’m Mr. Kelly, your AI teacher.");
  setTimeout(() => {
    addMessage(
      "bot",
      `Today’s subjects are: ${subjects.join(", ")}. Which one would you like to learn first?`
    );
  }, 1000);
});

chatForm.addEventListener("submit", async e => {
  e.preventDefault();
  const message = messageInput.value.trim();
  if (!message) return;

  addMessage("user", message);
  messageInput.value = "";

  if (!currentSubject) {
    const chosen = subjects.find(
      s => s.toLowerCase() === message.toLowerCase()
    );
    if (chosen) {
      currentSubject = chosen;
      addMessage("bot", `Excellent choice! Let's start ${chosen} class 📘`);
      setTimeout(() => {
        addMessage(
          "bot",
          `Ask me any ${chosen} question or topic you’d like to discuss.`
        );
      }, 800);
    } else {
      addMessage(
        "bot",
        `Hmm, I didn’t catch that. Please choose one of the subjects: ${subjects.join(", ")}`
      );
    }
    return;
  }

  // Normal conversation after subject is chosen
  addMessage("bot", "✏️ Thinking...");
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `(${currentSubject}) ${message}`,
        studentName,
      }),
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
