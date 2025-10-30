const welcomeText = "👋 Welcome! I'm Mr. Kelly, your coding teacher.";
let i = 0;
const speed = 60;
const element = document.getElementById("welcome-text");

function typeWriter() {
  if (i < welcomeText.length) {
    element.innerHTML += welcomeText.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }
}
window.onload = typeWriter;
