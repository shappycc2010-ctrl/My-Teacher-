const quizBtn = document.getElementById("quizBtn"); // new quiz button

async function startQuiz() {
  const subject = prompt("Which subject would you like a quiz on?");
  if (!subject) return;

  addMessage("user", `${studentName} wants a quiz on ${subject}.`);

  const res = await fetch("/api/quiz/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studentName, subject }),
  });

  const data = await res.json();
  addMessage("ai", "🧠 Quiz started!\n\n" + data.quiz);
}

// Send student answer to AI for grading
async function sendAnswer() {
  const question = prompt("Paste the question you're answering:");
  const answer = prompt("What is your answer? (A/B/C/D)");
  if (!question || !answer) return;

  addMessage("user", `${studentName}'s answer: ${answer}`);

  const res = await fetch("/api/quiz/answer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studentName, question, answer }),
  });

  const data = await res.json();
  addMessage("ai", "📊 " + data.feedback);
}

quizBtn.addEventListener("click", startQuiz);
