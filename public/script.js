const openDashboardBtn = document.getElementById("openDashboard");
const closeDashboardBtn = document.getElementById("closeDashboard");
const dashboard = document.getElementById("dashboard");

async function openDashboard() {
  const res = await fetch(`/api/dashboard/${studentName}`);
  const data = await res.json();

  dashboard.style.display = "block";

  // Create Chart.js chart dynamically
  const ctx = document.getElementById("quizChart").getContext("2d");
  if (window.quizChart) window.quizChart.destroy();

  window.quizChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: data.quizScores.map(q => q.subject),
      datasets: [{
        label: "Quiz Scores (out of 5)",
        data: data.quizScores.map(q => q.score),
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true, max: 5 }
      }
    }
  });

  document.getElementById("lessonSummary").innerHTML = `
    <p>Lessons Taken: <b>${data.lessonCount}</b></p>
    <p>Last Interaction: <i>${data.lastActive}</i></p>
  `;
}

function closeDashboard() {
  dashboard.style.display = "none";
}

openDashboardBtn.addEventListener("click", openDashboard);
closeDashboardBtn.addEventListener("click", closeDashboard);
