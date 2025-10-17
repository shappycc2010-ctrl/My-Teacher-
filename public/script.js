// public/script.js
const studentNameEl = document.getElementById("studentName");
const subjectSelect = document.getElementById("subjectSelect");
const levelSelect = document.getElementById("levelSelect");
const startLessonBtn = document.getElementById("startLessonBtn");

const lessonHeader = document.getElementById("lessonHeader");
const lessonContent = document.getElementById("lessonContent");
const quizArea = document.getElementById("quizArea");

const nextStepBtn = document.getElementById("nextStepBtn");
const askBtn = document.getElementById("askBtn");
const progressBtn = document.getElementById("progressBtn");
const statusEl = document.getElementById("status");

let activePlanId = null;
let activePlan = null;
let stepsCount = 0;

// helper to show status
function showStatus(text) { statusEl.textContent = text; }

// start lesson
startLessonBtn.addEventListener("click", async () => {
  const studentName = studentNameEl.value.trim() || "Student";
  const subject = subjectSelect.value;
  const level = levelSelect.value;
  showStatus("Creating lesson plan...");
  try {
    const res = await fetch("/api/lesson/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentName, subject, level })
    });
    const data = await res.json();
    activePlanId = data.planId;
    activePlan = data.plan;
    stepsCount = data.stepsCount || (data.plan.steps || []).length;
    lessonHeader.innerHTML = `<div><strong>${data.plan.title || subject}</strong><div style="color:#555">${data.summary || ""}</div></div>`;
    lessonContent.innerHTML = `<div style="color:#666">Ready. Click Next Step to begin.</div>`;
    nextStepBtn.disabled = false;
    quizArea.style.display = "none";
    showStatus("Lesson ready — click Next Step");
  } catch (err) {
    console.error(err);
    showStatus("Failed to create lesson. Check server logs.");
  }
});

// next step
nextStepBtn.addEventListener("click", async () => {
  const studentName = studentNameEl.value.trim() || "Student";
  if (!activePlanId) { showStatus("No active lesson. Start one first."); return; }
  showStatus("Fetching next step...");
  try {
    const res = await fetch("/api/lesson/next", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentName, planId: activePlanId })
    });
    const data = await res.json();
    if (data.finished) {
      lessonContent.innerHTML = `<div class="step-title">🎉 Lesson complete!</div><div>Now take the short quiz below.</div>`;
      nextStepBtn.disabled = true;
      // show quiz from plan steps
      setTimeout(() => startShortQuiz(), 600);
      showStatus("Lesson finished; preparing quiz...");
      return;
    }
    // show step
    lessonContent.innerHTML = `<div class="step-title">Step ${data.stepNumber}: ${data.title}</div>
      <div class="step-content">${data.content}</div>
      <div><em>Tip: You can click Ask Question to ask Mr. Kelly about this step.</em></div>`;
    // store active step quiz (string) in quizArea data
    quizArea.dataset.pendingQuiz = data.shortQuiz || "";
    showStatus(`Showing step ${data.stepNumber} of ${stepsCount}`);
  } catch (err) {
    console.error(err);
    showStatus("Error loading next step.");
  }
});

// ask question
askBtn.addEventListener("click", async () => {
  const studentName = studentNameEl.value.trim() || "Student";
  if (!activePlanId) { showStatus("Start lesson first."); return; }
  const question = prompt("Ask Mr. Kelly about the current step:");
  if (!question) return;
  showStatus("Asking Mr. Kelly...");
  try {
    const res = await fetch("/api/lesson/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentName, planId: activePlanId, question })
    });
    const data = await res.json();
    // show reply nicely
    const html = `<div class="step-title">Your question</div><div class="step-content">${question}</div>
      <div class="step-title">Mr. Kelly's answer</div><div class="step-content">${data.reply}</div>`;
    lessonContent.innerHTML = html;
    showStatus("Answer received");
  } catch (err) {
    console.error(err);
    showStatus("Failed to ask question.");
  }
});

// start a short quiz by reading quizzes from the plan's steps if present
async function startShortQuiz(){
  quizArea.style.display = "block";
  quizArea.innerHTML = "<h3>Short Quiz</h3>";
  // gather all shortQuiz strings from local lesson plan if available (call back to server progress)
  // For simplicity, we'll extract from activePlan if present
  const plan = activePlan || {};
  const steps = plan.steps || [];
  const questions = [];
  for (const s of steps) {
    if (s.shortQuiz && s.shortQuiz.trim()) questions.push(s.shortQuiz);
  }
  if (questions.length === 0) {
    quizArea.innerHTML += "<div>No short quizzes were provided in the lesson.</div>";
    showStatus("No quiz available.");
    return;
  }
  // present first question only (you can loop or present all)
  const rawQ = questions[0];
  // naive parse: split question and options (expect "A." etc.)
  let qText = rawQ;
  // create UI
  quizArea.innerHTML += `<div class="quiz-question">${qText}</div>`;
  const opts = ["A","B","C","D"];
  // let student pick by prompt to keep UI simple
  const answer = prompt("Quiz time! Copy the exact question shown (or type it) and then enter your option (A/B/C/D):\n\n" + qText + "\n\nEnter your option (A/B/C/D):");
  if (!answer) { showStatus("Quiz cancelled."); return; }
  // send to grade
  showStatus("Grading your answer...");
  try {
    const res = await fetch("/api/quiz/grade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentName: studentNameEl.value.trim() || "Student", planId: activePlanId, questionText: rawQ, selectedOption: answer.trim().toUpperCase() })
    });
    const data = await res.json();
    quizArea.innerHTML += `<div style="margin-top:12px"><strong>Result:</strong> ${data.correct ? "Correct ✅" : "Incorrect ❌"}</div>
      <div><strong>Explanation:</strong> ${data.explanation || ""}</div>
      <div><strong>Score:</strong> ${data.score || 0}</div>`;
    showStatus("Quiz graded.");
  } catch (err) {
    console.error(err);
    showStatus("Error grading quiz.");
  }
}

// view progress
progressBtn.addEventListener("click", async () => {
  const studentName = studentNameEl.value.trim() || "Student";
  showStatus("Loading progress...");
  try {
    const res = await fetch(`/api/progress/${encodeURIComponent(studentName)}`);
    const data = await res.json();
    // simple popup display
    const s = `Progress for ${data.studentName}\nLessons total: ${data.lessonCount}\nLessons completed: ${data.lessonsCompleted}\nAverage quiz score: ${data.avgScore ?? "N/A"}\n\nRecent quizzes:\n` +
      (data.quizzes && data.quizzes.length ? data.quizzes.slice(-5).map(q => `${q.subject || 'Q'}: ${q.score || q.score} (${new Date(q.date).toLocaleDateString()})`).join("\n") : "No quizzes yet.");
    alert(s);
    showStatus("Progress loaded");
  } catch (err) {
    console.error(err);
    showStatus("Failed to load progress.");
  }
});
