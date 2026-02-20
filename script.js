import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// ===== Firebase Config =====
const firebaseConfig = {
  apiKey: "AIzaSyCey1iYIcBvcd5qXOmDDbvJm5olf--sTw8",
  authDomain: "code-lab-official.firebaseapp.com",
  databaseURL: "https://code-lab-official-default-rtdb.firebaseio.com",
  projectId: "code-lab-official",
  storageBucket: "code-lab-official.firebasestorage.app",
  messagingSenderId: "658764557761",
  appId: "1:658764557761:web:b18df5a02f4ec87f22d340"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// ===== DOM Elements =====
const loginDiv = document.getElementById("login");
const dashboardDiv = document.getElementById("dashboard");
const userSpan = document.getElementById("user");
const xpSpan = document.getElementById("xp");
const xpFill = document.getElementById("xp-fill");
const badgesDiv = document.getElementById("badges");
const chaptersDiv = document.getElementById("chapters");
const lessonSection = document.getElementById("lesson-section");
const lessonTitle = document.getElementById("lesson-title");
const codeBox = document.getElementById("code-box");
const quizQuestion = document.getElementById("quiz-question");
const quizAnswers = document.getElementById("quiz-answers");
const editor = document.getElementById("editor");
const output = document.getElementById("output");

let lessons = [], currentLesson = 0, currentQuestion = 0, xp = 0;

// ===== Lessons Data (100 Lessons) =====

// Chapters 1–5: HTML Basics
for (let c = 1; c <= 5; c++) {
  for (let l = 1; l <= 5; l++) {
    let lessonIndex = (c - 1) * 5 + (l - 1);
    lessons[lessonIndex] = {
      chapter: `Chapter ${c}`,
      title: `Lesson ${l}`,
      code: `<h${l}>Heading ${l}</h${l}>\n<p>This is a paragraph for lesson ${l}.</p>`,
      questions: [
        { question: `Which tag creates the heading in lesson ${l}?`, answer: `<h${l}>`, explanation: `The <h${l}> tag creates the heading.` },
        { question: `Which tag creates the paragraph?`, answer: "<p>", explanation: "<p> defines a paragraph." },
        { question: `If you wanted another paragraph, which tag would you use?`, answer: "<p>", explanation: "Use <p> for each paragraph." },
        { question: `Which part is displayed as the heading?`, answer: `<h${l}>Heading ${l}</h${l}>`, explanation: "Text inside <h${l}> is the heading." },
        { question: `Which tag is used to create links?`, answer: "<a>", explanation: "<a> creates hyperlinks." }
      ]
    };
  }
}

// Chapters 6–10: CSS Basics
for (let c = 6; c <= 10; c++) {
  for (let l = 1; l <= 5; l++) {
    let lessonIndex = (c - 1) * 5 + (l - 1);
    lessons[lessonIndex] = {
      chapter: `Chapter ${c}`,
      title: `Lesson ${l}`,
      code: `<!DOCTYPE html>
<html>
<head>
<style>
p { color: ${l % 2 === 0 ? "blue" : "green"}; font-size: ${12 + l * 2}px; }
</style>
</head>
<body>
<p>This paragraph has styles applied.</p>
</body>
</html>`,
      questions: [
        { question: "Which tag contains the CSS?", answer: "<style>", explanation: "<style> tag is used for internal CSS." },
        { question: "Which property changes text color?", answer: "color", explanation: "CSS 'color' sets the text color." },
        { question: "Which tag shows the styled paragraph?", answer: "<p>", explanation: "<p> is the paragraph element." },
        { question: "What attribute changes font size?", answer: "font-size", explanation: "CSS 'font-size' sets text size." },
        { question: "Does this code use inline or internal CSS?", answer: "internal", explanation: "CSS is inside <style> in the head, so internal." }
      ]
    };
  }
}

// Chapters 11–15: JavaScript Basics
for (let c = 11; c <= 15; c++) {
  for (let l = 1; l <= 5; l++) {
    let lessonIndex = (c - 1) * 5 + (l - 1);
    lessons[lessonIndex] = {
      chapter: `Chapter ${c}`,
      title: `Lesson ${l}`,
      code: `<!DOCTYPE html>
<html>
<body>
<p id="demo">Click the button.</p>
<button onclick="document.getElementById('demo').innerText='Hello World!'">Click Me</button>
</body>
</html>`,
      questions: [
        { question: "What happens when the button is clicked?", answer: "Paragraph text changes to Hello World!", explanation: "The onclick changes innerText of #demo." },
        { question: "Which element changes on click?", answer: "#demo", explanation: "The paragraph with id 'demo' is updated." },
        { question: "Which JS event is used here?", answer: "onclick", explanation: "The 'onclick' event runs the code when clicked." },
        { question: "Where is the JS written?", answer: "inline", explanation: "JS is inline inside the button element." },
        { question: "What property updates the paragraph?", answer: "innerText", explanation: "'innerText' sets the text content." }
      ]
    };
  }
}

// Chapters 16–20: Mini-Projects (combined HTML/CSS/JS)
for (let c = 16; c <= 20; c++) {
  for (let l = 1; l <= 5; l++) {
    let lessonIndex = (c - 1) * 5 + (l - 1);
    lessons[lessonIndex] = {
      chapter: `Chapter ${c}`,
      title: `Mini-Project ${l}`,
      code: `<button onclick="alert('Lesson ${l} Clicked!')">Click Me</button>
<p id="demo">Watch for alert.</p>`,
      questions: [
        { question: "What happens when you click the button?", answer: "Alert shows 'Lesson ${l} Clicked!'", explanation: "The onclick triggers alert with that text." },
        { question: "Which JS function is used for pop-up?", answer: "alert()", explanation: "alert() shows a popup box." },
        { question: "Which element is visible but not changing?", answer: "<p id='demo'>", explanation: "The paragraph is displayed but unchanged." },
        { question: "How can you change paragraph text?", answer: "document.getElementById('demo').innerText", explanation: "Use JS to change innerText." },
        { question: "Which HTML tag is used for button?", answer: "<button>", explanation: "<button> defines clickable button." }
      ]
    };
  }
}

// ===== Auth =====
onAuthStateChanged(auth, user => {
  if (user) {
    userSpan.innerText = user.email;
    loginDiv.style.display = "none";
    dashboardDiv.style.display = "block";
    loadProgress();
  } else {
    loginDiv.style.display = "block";
    dashboardDiv.style.display = "none";
  }
});

window.registerUser = () => {
  const emailInput = document.getElementById("email").value;
  const passwordInput = document.getElementById("password").value;
  createUserWithEmailAndPassword(auth, emailInput, passwordInput)
    .then(u => alert("Registered ✅ " + u.user.email))
    .catch(e => alert("Error ❌ " + e.message));
};

window.loginUser = () => {
  const emailInput = document.getElementById("email").value;
  const passwordInput = document.getElementById("password").value;
  signInWithEmailAndPassword(auth, emailInput, passwordInput)
    .then(u => alert("Logged in ✅ " + u.user.email))
    .catch(e => alert("Error ❌ " + e.message));
};

// ===== Progress =====
async function loadProgress() {
  const snap = await get(ref(database, 'users/' + auth.currentUser.uid));
  if (snap.exists()) xp = snap.val().xp || 0;
  updateXP();
  renderChapters();
}

function saveProgress() { set(ref(database, 'users/' + auth.currentUser.uid), { xp }); }

function updateXP() { xpSpan.innerText = xp; xpFill.style.width = (xp % 100) + "%"; }

// ===== Chapters =====
function renderChapters() {
  let html = "";
  lessons.forEach((l, i) => html += `<div class="card"><h4>${l.chapter} - ${l.title}</h4><button onclick="startLesson(${i})">Start</button></div>`);
  chaptersDiv.innerHTML = html;
}

// ===== Lesson =====
window.startLesson = function (i) {
  currentLesson = i;
  currentQuestion = 0;
  lessonTitle.innerText = lessons[i].title;
  codeBox.innerHTML = lessons[i].code;
  editor.value = lessons[i].code;
  loadQuestion();
  lessonSection.scrollIntoView({ behavior: "smooth" });
}

// ===== Quiz =====
function loadQuestion() {
  const q = lessons[currentLesson].questions[currentQuestion];
  quizQuestion.innerText = q.question;
  quizAnswers.innerHTML = `<button onclick="checkAnswer()">${q.answer}</button>`;
}

window.checkAnswer = function () {
  const q = lessons[currentLesson].questions[currentQuestion];
  alert("Correct ✅\n" + q.explanation);
  xp += 10;
  updateXP();
  saveProgress();
}

window.nextQuestion = function () { if (currentQuestion < lessons[currentLesson].questions.length - 1) currentQuestion++; loadQuestion(); }
window.prevQuestion = function () { if (currentQuestion > 0) currentQuestion--; loadQuestion(); }

// ===== Editor =====
window.runCode = function () { output.srcdoc = editor.value; }

// ===== Dark/Light Mode =====
window.toggleDarkLight = function () { document.body.classList.toggle("dark"); }

// ===== Screen Size =====
window.setScreen = function (mode) {
  if (mode === 'mobile') { document.body.style.width = '360px'; document.body.style.margin = 'auto'; }
  else { document.body.style.width = '100%'; document.body.style.margin = '0'; }
}