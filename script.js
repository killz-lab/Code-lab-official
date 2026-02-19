const lessons = [
  {
    level: "Beginner",
    text: "HTML = structure of a website",
    code: "<h1>Hello World</h1>",
    type: "html",
    xp: 10,
    media: "<img src='https://via.placeholder.com/300x150.png?text=HTML+Example' alt='HTML Example'>",
    quiz: {
      question: "What does HTML stand for?",
      options: ["Hyper Text Markup Language", "High Text Make Language", "Hyperlink and Text", "Home Tool Markup"],
      answer: 0
    }
  },
  {
    level: "Beginner",
    text: "CSS = makes it look good",
    code: "p { color: red; }",
    type: "css",
    xp: 10,
    media: "<img src='https://via.placeholder.com/300x150.png?text=CSS+Example' alt='CSS Example'>",
    quiz: {
      question: "CSS is used for?",
      options: ["Structure", "Style", "Logic", "Database"],
      answer: 1
    }
  },
  {
    level: "Intermediate",
    text: "How to make a website",
    code: "Combine HTML + CSS + JS",
    type: "html",
    xp: 20,
    media: "<video width='300' controls><source src='https://www.w3schools.com/html/mov_bbb.mp4' type='video/mp4'></video>",
    quiz: {
      question: "Which three technologies build websites?",
      options: ["HTML, CSS, JS", "PHP, Python, JS", "HTML, PHP, CSS", "JS, CSS, SQL"],
      answer: 0
    }
  },
  {
    level: "Advanced",
    text: "Advanced HTML",
    code: "Forms, tables, semantic tags",
    type: "html",
    xp: 30,
    media: "<img src='https://via.placeholder.com/300x150.png?text=Advanced+HTML' alt='Advanced HTML'>",
    quiz: {
      question: "What tag is semantic HTML?",
      options: ["<div>", "<section>", "<span>", "<b>"],
      answer: 1
    }
  }
];

// Load progress
let i = parseInt(localStorage.getItem("lessonIndex")) || 0;
let totalXP = parseInt(localStorage.getItem("totalXP")) || 0;
let totalCorrect = parseInt(localStorage.getItem("totalCorrect")) || 0;

const lessonDiv = document.getElementById("lesson");
const levelDiv = document.getElementById("level");
const progressDiv = document.getElementById("progress");
const xpFill = document.getElementById("xp-fill");
const levelFill = document.getElementById("level-fill");
const mediaContainer = document.getElementById("media-container");

const quizContainer = document.getElementById("quiz-container");
const quizQuestion = document.getElementById("quiz-question");
const quizOptions = document.getElementById("quiz-options");
const quizFeedback = document.getElementById("quiz-feedback");
const submitAnswerBtn = document.getElementById("submit-answer");

const codeInput = document.getElementById("code-input");
const codeOutput = document.getElementById("code-output");

const certificate = document.getElementById("certificate");
const finalXP = document.getElementById("final-xp");

let selectedAnswer = null;

function showLesson(){
  if(i>=lessons.length){
    // Show certificate
    certificate.style.display = "block";
    lessonDiv.style.display = "none";
    mediaContainer.style.display = "none";
    quizContainer.style.display = "none";
    finalXP.innerText = `Total XP: ${totalXP}, Quizzes Correct: ${totalCorrect}/${lessons.length}`;
    return;
  } else {
    certificate.style.display = "none";
    lessonDiv.style.display = "block";
  }

  const lesson = lessons[i];
  levelDiv.innerText = lesson.level;
  lessonDiv.innerHTML = `<p>${lesson.text}</p><div class="code-box code-${lesson.type}">${lesson.code}</div>`;

  progressDiv.innerText = `Lesson ${i+1} of ${lessons.length}`;

  if(lesson.media){
    mediaContainer.style.display = "block";
    mediaContainer.innerHTML = lesson.media;
  } else {
    mediaContainer.style.display = "none";
  }

  // XP & level
  const xpPercent = Math.min((totalXP / 100) * 100, 100);
  xpFill.style.width = xpPercent + "%";

  let levelPercent = 0;
  if (lesson.level==="Beginner") levelPercent = 33;
  else if(lesson.level==="Intermediate") levelPercent = 66;
  else if(lesson.level==="Advanced") levelPercent = 100;
  levelFill.style.width = levelPercent + "%";

  codeInput.value = "";
  codeOutput.srcdoc = "";

  startQuiz();

  localStorage.setItem("lessonIndex", i);
  localStorage.setItem("totalXP", totalXP);
  localStorage.setItem("totalCorrect", totalCorrect);
}

function runCode(){
  codeOutput.srcdoc = codeInput.value;
}

function startQuiz(){
  if(i>=lessons.length){ quizContainer.style.display="none"; return; }
  const lesson = lessons[i];
  if(!lesson.quiz){ quizContainer.style.display="none"; return; }

  quizContainer.style.display="block";
  quizQuestion.innerText = lesson.quiz.question;
  quizFeedback.innerText="";
  quizOptions.innerHTML="";
  lesson.quiz.options.forEach((opt,index)=>{
    const btn = document.createElement("button");
    btn.innerText=opt;
    btn.onclick=()=> selectedAnswer=index;
    quizOptions.appendChild(btn);
  });
}

submitAnswerBtn.onclick = function(){
  const lesson = lessons[i];
  if(selectedAnswer===lesson.quiz.answer){
    quizFeedback.innerText="✅ Correct!";
    totalXP+=5;
    totalCorrect++;
  } else {
    quizFeedback.innerText="❌ Incorrect!";
  }
  selectedAnswer=null;
  showLesson();
}

function nextLesson(){
  i++;
  showLesson();
}

function prevLesson(){
  i--;
  if(i<0) i=0;
  showLesson();
}

function resetProgress(){
  i=0;
  totalXP=0;
  totalCorrect=0;
  localStorage.removeItem("lessonIndex");
  localStorage.removeItem("totalXP");
  localStorage.removeItem("totalCorrect");
  showLesson();
}

showLesson();