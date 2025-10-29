// Mr. Kelly Lesson 1 typing-only flow
const welcomeScreen = document.getElementById('welcomeScreen');
const classroom = document.getElementById('classroom');
const typedText = document.getElementById('typedText');
const continueBtn = document.getElementById('continueBtn');
const restartBtn = document.getElementById('restartBtn');
const endCta = document.getElementById('endCta');
const subscribeBtn = document.getElementById('subscribeBtn');

const STORAGE_KEY = 'mrkelly_lesson1_step_v1';

// Lesson sections (array of strings). Mr. Kelly will type these in order.
const LESSON = [
`Hello, how are you doing? Welcome to class. Today we’ll begin with the creation of the web.

I'll guide you step-by-step so you can understand how the web came to be, how it works, and the basic parts you need to start building websites.`,
`1) Why the web was created
The web started as a way for researchers to share documents across computers. It connects people across the world by using a protocol called HTTP and documents written in HTML. Tim Berners-Lee proposed it so information could be easily linked and accessed.`,
`2) Basic pieces: browsers, servers, and HTML
- A browser (like Chrome or Firefox) requests a page.
- A web server (like Apache or Nginx) responds with files or data.
- HTML (HyperText Markup Language) is the structure of a page. CSS styles it, and JavaScript makes it interactive.`,
`3) How a simple page loads
When you type a URL and press Enter:
- The browser asks the DNS for the server address.
- The browser sends an HTTP request to the server.
- The server sends back an HTML response.
- The browser renders HTML, applies CSS, and runs JavaScript, forming the page you see.`,
`4) Why that matters for you as a coder
Understanding these steps helps you debug pages, choose tools, and know where to write code. You’ll soon make pages, style them with CSS, and add behavior with JavaScript. Practice makes it real!`,
`Quick recap:
- The web links computers and people.
- HTML structures content; CSS styles it; JS makes it interactive.
- Browsers request, servers respond — and you, the coder, create the content.
Great job getting through Lesson 1! If you'd like to continue to Lesson 2 (HTML basics), subscribe to unlock more lessons and projects.`
];

// Controls state
let step = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
if (isNaN(step)) step = 0;
let typing = false;
let cursorEl = null;

// show welcome, then transition into classroom
function showLesson() {
  // fade out the big WELCOME quickly and show classroom
  welcomeScreen.classList.add('hidden');
  classroom.classList.remove('hidden');
  loadStep(step);
}

// typewriter: types a given string into the typedText container
function typeString(text, speed = 28) {
  return new Promise((resolve) => {
    typedText.innerHTML = '';
    // create a span for cursor
    cursorEl = document.createElement('span');
    cursorEl.className = 'typing-cursor';
    let i = 0;
    typing = true;

    function nextChar() {
      if (i < text.length) {
        // append next char
        typedText.innerHTML += escapeHtml(text.charAt(i));
        i++;
        // ensure cursor at end
        if (!typedText.contains(cursorEl)) typedText.appendChild(cursorEl);
        setTimeout(nextChar, speed);
      } else {
        // remove cursor
        if (typedText.contains(cursorEl)) typedText.removeChild(cursorEl);
        typing = false;
        resolve();
      }
    }
    nextChar();
  });
}

// escape HTML to avoid accidental tags
function escapeHtml(ch) {
  const s = ch.replace ? ch.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : ch;
  return s;
}

// load a lesson step
async function loadStep(index) {
  if (index < 0) index = 0;
  if (index >= LESSON.length) {
    // finished
    typedText.innerHTML = '';
    document.getElementById('lessonHeader').innerHTML = '<h2>Lesson complete</h2><div class="subtle">Nice work — you can subscribe to continue learning.</div>';
    document.querySelector('.controls').classList.add('hidden');
    endCta.classList.remove('hidden');
    return;
  }
  // show the section text
  await typeString(LESSON[index]);
  // store progress
  localStorage.setItem(STORAGE_KEY, String(index));
}

// continue button
continueBtn.addEventListener('click', async () => {
  if (typing) return; // prevent skipping mid-typing
  step = Math.min(step + 1, LESSON.length);
  await loadStep(step);
});

// restart
restartBtn.addEventListener('click', async () => {
  if (confirm('Restart the lesson from the beginning?')) {
    step = 0;
    localStorage.setItem(STORAGE_KEY, '0');
    document.querySelector('.controls').classList.remove('hidden');
    endCta.classList.add('hidden');
    document.getElementById('lessonHeader').innerHTML = '<h2>Lesson 1 — The Creation of the Web</h2><div class="subtle">Typed by Mr. Kelly — read along and click "Continue" when ready</div>';
    await loadStep(0);
  }
});

// subscribe button action (simple redirect)
subscribeBtn.addEventListener('click', () => {
  window.location.href = '/subscribe';
});

// initial behavior: show welcome for 1.6s then show lesson
window.addEventListener('load', () => {
  setTimeout(() => {
    showLesson();
  }, 1400); // give big WELCOME a moment
});
function typeText(element, text, speed = 50, callback) {
  let index = 0;
  const interval = setInterval(() => {
    element.textContent += text.charAt(index);
    index++;
    if (index === text.length) {
      clearInterval(interval);
      element.style.borderRight = "none"; // stop cursor blink
      if (callback) callback();
    }
  }, speed);
}

window.onload = function() {
  const message = "Hello there! 👋 I’m Mr. Kelly, your coding teacher. Today we’ll learn how the web was created...";
  const output = document.querySelector(".typewriter");

  typeText(output, message, 45, () => {
    document.querySelector("#continue-btn").style.display = "block";
  });
};
