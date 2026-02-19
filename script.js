// ------------------------
// Helper: Escape HTML for code boxes
// ------------------------
function escapeHTML(str){
  return str.replace(/&/g,'&amp;')
            .replace(/</g,'&lt;')
            .replace(/>/g,'&gt;');
}

// ------------------------
// Chapters & Lessons
// ------------------------
const chapters=[];
for(let c=1;c<=20;c++){
  const chapter={name:`Chapter ${c}`,lessons:[]};
  for(let q=1;q<=5;q++){
    let codeSnippet="", codeType="html";
    if(c<=5){ // HTML
      if(q===1) codeSnippet="<h1>Hello World!</h1>";
      else if(q===2) codeSnippet="<p>This is a paragraph</p>";
      else if(q===3) codeSnippet="<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>";
      else if(q===4) codeSnippet="<a href='#'>Click Me</a>";
      else codeSnippet="<img src='https://via.placeholder.com/100' alt='Image'>";
      codeType="html";
    } else if(c<=10){ // CSS
      if(q===1) codeSnippet="body { background-color: lightblue; }";
      else if(q===2) codeSnippet="p { color: red; font-size: 18px; }";
      else if(q===3) codeSnippet="ul li { list-style-type: square; }";
      else if(q===4) codeSnippet="a { text-decoration: none; color: green; }";
      else codeSnippet="img { border-radius: 10px; }";
      codeType="css";
    } else if(c<=15){ // JS
      if(q===1) codeSnippet="function greet(){ console.log('Hello'); }";
      else if(q===2) codeSnippet="let x = 5; let y = 10; console.log(x + y);";
      else if(q===3) codeSnippet="for(let i=0;i<5;i++){ console.log(i); }";
      else if(q===4) codeSnippet="const arr = [1,2,3]; arr.forEach(n=>console.log(n));";
      else codeSnippet="let obj = {name:'Alice', age:14}; console.log(obj.name);";
      codeType="js";
    } else { // Advanced JS / DOM
      if(q===1) codeSnippet="document.body.style.backgroundColor='yellow';";
      else if(q===2) codeSnippet="let btn = document.createElement('button'); btn.innerText='Click'; document.body.appendChild(btn);";
      else if(q===3) codeSnippet="btn.addEventListener('click',()=>alert('Hello!'));";
      else if(q===4) codeSnippet="const div=document.createElement('div'); div.id='box'; document.body.appendChild(div);";
      else codeSnippet="document.getElementById('box').style.width='100px';";
      codeType="js";
    }

    const mediaSnippet=`<div class="code-box code-${codeType}">${escapeHTML(codeSnippet)}</div>`;
    chapter.lessons.push({
      level:c<=10?"Beginner":c<=15?"Intermediate":"Advanced",
      text:`Lesson ${q} of ${chapter.name}`,
      code: codeSnippet,
      type: codeType,
      xp: 5+c,
      media: mediaSnippet,
      quiz:{
        question:`What does this code do in ${chapter.name} Lesson ${q}?`,
        options:[
          `Does nothing`,
          `Displays content on screen`,
          `Changes background/style`,
          `Logs to console`,
          `Other`
        ],
        answer:c<=5||c>10?q===3?2:q===4?3:1:q===1?2:q===2?3:q===3?4:1,
        explanation:`This code ${c<=5?"displays content on screen":c<=10?"changes style/CSS":q<=15?"logs to console or manipulates variables/arrays":"manipulates DOM or styles"}`
      },
      challenge:{
        description:`Write a code snippet similar to the example in ${chapter.name} Lesson ${q}`,
        test: codeSnippet
      }
    });
  }
  chapters.push(chapter);
}

// Flatten lessons
let lessons=[];
chapters.forEach(c=>c.lessons.forEach(l=>lessons.push(l)));

// ------------------------
// State
// ------------------------
let i=0, xp=0, level=1, streak=0, badges=[];

// ------------------------
// DOM Elements
// ------------------------
const lessonDiv=document.getElementById("lesson");
const mediaContainer=document.getElementById("media");
const xpFill=document.getElementById("xp-fill");
const levelFill=document.getElementById("level-fill");
const badgeList=document.getElementById("badge-list");
const quizQuestion=document.getElementById("quiz-question");
const quizOptions=document.getElementById("quiz-options");
const liveEditor=document.getElementById("live-editor");
const challengeInput=document.getElementById("challenge-input");
const codeOutput=document.getElementById("code-output");
const progressText=document.getElementById("progress");
const certificate=document.getElementById("certificate");

// ------------------------
// Show Lesson
// ------------------------
function showLesson(){
  const lesson=lessons[i];
  lessonDiv.innerHTML=`<p>${lesson.text} - Level: ${lesson.level}</p>`;
  mediaContainer.innerHTML=lesson.media;
  progressText.innerText=`Lesson ${i+1} of ${lessons.length}`;
  updateXP();
  showQuiz();
}

// ------------------------
// Next / Prev
// ------------------------
function nextLesson(){ i++; if(i>=lessons.length)i=0; showLesson(); }
function prevLesson(){ i--; if(i<0)i=lessons.length-1; showLesson(); }

// ------------------------
// XP / Level
// ------------------------
function updateXP(){
  xpFill.style.width = `${(xp/100)*100}%`;
  levelFill.style.width = `${(level/20)*100}%`;
}

// ------------------------
// Quiz
// ------------------------
function showQuiz(){
  const lesson=lessons[i];
  quizQuestion.innerText=lesson.quiz.question;
  quizOptions.innerHTML="";
  lesson.quiz.options.forEach((opt, idx)=>{
    const btn=document.createElement("button");
    btn.innerText=opt;
    btn.onclick=()=>submitAnswer(idx);
    quizOptions.appendChild(btn);
  });
}

function submitAnswer(idx){
  const lesson=lessons[i];
  if(idx===lesson.quiz.answer){
    alert("Correct! ✅\n"+lesson.quiz.explanation);
    xp+=lesson.xp;
  } else{
    alert("Wrong ❌\n"+lesson.quiz.explanation);
  }
  streak++;
  badges.push(`Badge ${streak}`);
  updateXP();
  renderBadges();
}

// ------------------------
// Badges
// ------------------------
function renderBadges(){
  badgeList.innerHTML="";
  badges.forEach(b=>{const d=document.createElement("div");d.className="badge";d.innerText=b;badgeList.appendChild(d);});
}

// ------------------------
// Live editor / challenge
// ------------------------
function runChallenge() {
  const lesson = lessons[i];
  const code = challengeInput.value;
  codeOutput.innerHTML = "";
  if(lesson.type==="html") codeOutput.innerHTML = code;
  else if(lesson.type==="css"){
    const style = document.createElement("style");
    style.innerHTML = code;
    codeOutput.appendChild(style);
    codeOutput.innerHTML += "<p>Preview paragraph</p><ul><li>Item 1</li><li>Item 2</li></ul><a href='#'>Link Example</a>";
  } else if(lesson.type==="js"){
    try {
      let consoleOutput="";
      const originalLog=console.log;
      console.log=function(...args){consoleOutput+=args.join(" ")+"\n"; originalLog.apply(console,args);}
      eval(code);
      codeOutput.innerText = consoleOutput || "JS ran successfully!";
      console.log = originalLog;
    } catch(err){ codeOutput.innerText = "Error: "+err; }
  }
}

// ------------------------
// Init
// ------------------------
showLesson();