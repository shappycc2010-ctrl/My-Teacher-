const API_BASE = "https://my-teacher-1.onrender.com"; // your backend
const chatEl = document.getElementById("chat");
const sendBtn = document.getElementById("sendBtn");
const messageEl = document.getElementById("message");
const nameEl = document.getElementById("name");
const modeEl = document.getElementById("mode");
const statusEl = document.getElementById("status");
const clearBtn = document.getElementById("clearBtn");

let history = JSON.parse(localStorage.getItem("mk_history") || "[]");

// render existing history
function render() {
  chatEl.innerHTML = "";
  history.forEach(item => {
    const div = document.createElement("div");
    div.className = "msg " + (item.sender === "me" ? "me" : "ai");
    const bubble = document.createElement("div");
    bubble.className = "bubble";
    if(item.sender === "me"){
      bubble.innerHTML = `<div class="meta">${item.name || "You"} <span class="time">${item.time}</span></div><div>${escapeHtml(item.text)}</div>`;
    } else {
      bubble.innerHTML = `<div class="meta">Mr. Kelly <span class="time">${item.time}</span></div><div>${escapeHtml(item.text)}</div>`;
    }
    div.appendChild(bubble);
    chatEl.appendChild(div);
  });
  chatEl.scrollTop = chatEl.scrollHeight;
}

function escapeHtml(unsafe) {
  if(!unsafe) return "";
  return unsafe.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
}

function pushMessage(sender, text, name){
  const now = new Date();
  const time = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  history.push({ sender, text, time, name });
  localStorage.setItem("mk_history", JSON.stringify(history));
  render();
}

// show typing indicator (temporary bubble)
function showTyping(){
  const div = document.createElement("div");
  div.className = "msg ai";
  div.id = "typingIndicator";
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.innerHTML = `<div class="meta">Mr. Kelly <span class="time">${new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</span></div>
    <div class="typing"><span></span><span></span><span></span></div>`;
  div.appendChild(bubble);
  chatEl.appendChild(div);
  chatEl.scrollTop = chatEl.scrollHeight;
}

// remove typing indicator
function hideTyping(){
  const el = document.getElementById("typingIndicator");
  if(el) el.remove();
}

async function sendMessage(){
  const message = messageEl.value.trim();
  if(!message) return;
  const studentName = nameEl.value.trim() || "Student";
  const mode = modeEl.value || "general";

  pushMessage("me", message, studentName);
  messageEl.value = "";
  statusEl.textContent = "Sending...";

  showTyping();

  try {
    const res = await fetch(API_BASE + "/api/chat", {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ studentName, message, mode })
    });

    hideTyping();

    if(!res.ok){
      statusEl.textContent = `Error ${res.status}`;
      pushMessage("ai", "Sorry — I couldn't reach Mr. Kelly.", "Mr. Kelly");
      return;
    }

    const data = await res.json();
    const reply = data.reply || "No response.";
    pushMessage("ai", reply, "Mr. Kelly");
    statusEl.textContent = "Last message delivered.";
  } catch (err) {
    hideTyping();
    statusEl.textContent = "Network error.";
    pushMessage("ai", "Network error while contacting Mr. Kelly.", "Mr. Kelly");
    console.error(err);
  }
}

sendBtn.addEventListener("click", sendMessage);
messageEl.addEventListener("keydown", (e) => {
  if(e.key === "Enter" && !e.shiftKey){
    e.preventDefault();
    sendMessage();
  }
});
clearBtn.addEventListener("click", () => {
  history = [];
  localStorage.removeItem("mk_history");
  render();
});

// initial render
render();
