// ------------------------
// Chapters + Lessons Setup
// ------------------------
const chapters=[];
for(let c=1;c<=20;c++){
  const chapter={name:`Chapter ${c}`,lessons:[]};
  for(let q=1;q<=5;q++){
    chapter.lessons.push({
      level:c<=10?"Beginner":c<=15?"Intermediate":"Advanced",
      text:`Lesson ${q} of ${chapter.name}`,
      code:`// Example code for ${chapter.name} lesson ${q}`,
      type:"js",
      xp:5+c,
      media:`<div class="code-box code-js">// Code example for ${chapter.name} lesson ${q}</div>`,
      quiz:{
        question:`Question ${q} of ${chapter.name}`,
        options:[
          `Option A for ${chapter.name} Q${q}`,
          `Option B for ${chapter.name} Q${q}`,
          `Option C for ${chapter.name} Q${q}`,
          `Option D for ${chapter.name} Q${q}`,
          `Option E for ${chapter.name} Q${q}`
        ],
        answer:Math.floor(Math.random()*5),
        explanation:`Correct answer is Option ${String.fromCharCode(65+Math.floor(Math.random()*5))}`
      },
      challenge:{
        description:`Write a function that logs "${chapter.name} L${q}"`,
        test:`console.log("${chapter.name} L${q}")`
      }
    });
  }
  chapters.push(chapter);
}
let lessons=[];
chapters.forEach(c=>c.lessons.forEach(l=>lessons.push(l)));

// ------------------------
// State + DOM
// ------------------------
let i=parseInt(localStorage.getItem("lessonIndex"))||0;
let totalXP=parseInt(localStorage.getItem("totalXP"))||0;
let totalCorrect=parseInt(localStorage.getItem("totalCorrect"))||0;
let badges=[];
let streak=parseInt(localStorage.getItem("streak"))||0;
let lastVisit=localStorage.getItem("lastVisit");

const lessonDiv=document.getElementById("lesson");
const levelDiv=document.getElementById("level");
const chapterNameDiv=document.getElementById("chapter-name");
const progressDiv=document.getElementById("progress");
const xpFill=document.getElementById("xp-fill");
const levelFill=document.getElementById("level-fill");
const mediaContainer=document.getElementById("media-container");
const quizContainer=document.getElementById("quiz-container");
const quizQuestion=document.getElementById("quiz-question");
const quizOptions=document.getElementById("quiz-options");
const quizFeedback=document.getElementById("quiz-feedback");
const submitAnswerBtn=document.getElementById("submit-answer");
const codeInput=document.getElementById("code-input");
const codeOutput=document.getElementById("code-output");
const challengeInput=document.getElementById("challenge-input");
const challengeFeedback=document.getElementById("challenge-feedback");
const badgeList=document.getElementById("badge-list");
const certificate=document.getElementById("certificate");
const finalXP=document.getElementById("final-xp");
const finalBadges=document.getElementById("final-badges");
const finalStreak=document.getElementById("final-streak");
const streakCount=document.getElementById("streak-count");
const summaryXP=document.getElementById("summary-xp");
const summaryCorrect=document.getElementById("summary-correct");
const summaryBadges=document.getElementById("summary-badges");
const summaryStreak=document.getElementById("summary-streak");

let selectedAnswer=null;

// ------------------------
// Update Daily Streak
// ------------------------
function updateStreak(){
  const today=new Date().toDateString();
  if(lastVisit!==today){
    if(lastVisit && (new Date(today)-new Date(lastVisit))/86400000===1){ streak++; }
    else if(!lastVisit || (new Date(today)-new Date(lastVisit))/86400000>1){ streak=1; }
    lastVisit=today;
    localStorage.setItem("lastVisit",lastVisit);
    localStorage.setItem("streak",streak);
  }
  streakCount.innerText=`${streak} days`;
}

// ------------------------
// Show Lesson
// ------------------------
function showLesson(){
  updateStreak();
  if(i>=lessons.length){
    certificate.style.display="block";
    lessonDiv.style.display="none";
    mediaContainer.style.display="none";
    quizContainer.style.display="none";
    document.getElementById("challenge-container").style.display="none";
    chapterNameDiv.style.display="none";
    finalXP.innerText=`Total XP: ${totalXP}, Quizzes Correct: ${totalCorrect}/${lessons.length}`;
    finalBadges.innerText=`Badges: ${badges.join(", ")}`;
    finalStreak.innerText=`Streak: ${streak} days`;
    return;
  }else{
    certificate.style.display="none";
    lessonDiv.style.display="block";
    chapterNameDiv.style.display="block";
  }
  const lesson=lessons[i];
  const chapterNum=Math.floor(i/5)+1;
  const lessonNum=(i%5)+1;
  chapterNameDiv.innerText=`Chapter ${chapterNum}, Lesson ${lessonNum}`;
  levelDiv.innerText=lesson.level;
  lessonDiv.innerHTML=`<p>${lesson.text}</p><div class="code-box code-${lesson.type}">${lesson.code}</div>`;
  progressDiv.innerText=`Lesson ${i+1} of ${lessons.length}`;
  mediaContainer.innerHTML=lesson.media;
  mediaContainer.style.display=lesson.media?"block":"none";

  xpFill.style.width=Math.min((totalXP/500)*100,100)+"%";
  levelFill.style.width=lesson.level==="Beginner"?33:lesson.level==="Intermediate"?66:100+"%";

  codeInput.value="";
  codeOutput.srcdoc="";

  challengeInput.value="";
  challengeFeedback.innerText="";

  startQuiz();
  localStorage.setItem("lessonIndex",i);
  localStorage.setItem("totalXP",totalXP);
  localStorage.setItem("totalCorrect",totalCorrect);
  localStorage.setItem("badges",JSON.stringify(badges));
}

// ------------------------
// Run Live Code
// ------------------------
function runCode(){codeOutput.srcdoc=codeInput.value;}

// ------------------------
// Quiz Logic
// ------------------------
function startQuiz(){
  const lesson=lessons[i];
  if(!lesson.quiz){quizContainer.style.display="none";return;}
  quizContainer.style.display="block";
  quizQuestion.innerText=lesson.quiz.question;
  quizFeedback.innerText="";
  quizOptions.innerHTML="";
  lesson.quiz.options.forEach((opt,index)=>{
    const btn=document.createElement("button");
    btn.innerText=opt;
    btn.onclick=()=>selectedAnswer=index;
    quizOptions.appendChild(btn);
  });
}
submitAnswerBtn.onclick=function(){
  const lesson=lessons[i];
  if(selectedAnswer===lesson.quiz.answer){
    quizFeedback.innerText=`✅ Correct! ${lesson.quiz.explanation}`;
    totalXP+=5;
    totalCorrect++;
  }else{
    quizFeedback.innerText=`❌ Wrong! ${lesson.quiz.explanation}`;
  }
  selectedAnswer=null;
  if((i+1)%5===0 && !badges.includes(`Chapter ${(Math.floor(i/5)+1)} Complete`)){
    badges.push(`Chapter ${(Math.floor(i/5)+1)} Complete`);
    updateBadges();
  }
  showLesson();
}

// ------------------------
// Mini Coding Challenge
// ------------------------
function runChallenge(){
  const lesson=lessons[i];
  try{
    const userCode=challengeInput.value;
    const expected=lesson.challenge.test;
    if(userCode.includes(expected)){
      challengeFeedback.innerText="✅ Challenge Passed!";
      totalXP+=10;
    }else{
      challengeFeedback.innerText=`❌ Challenge Failed! Expected code snippet: ${expected}`;
    }
  }catch(e){challengeFeedback.innerText="❌ Error running code";}
  showLesson();
}

// ------------------------
// Update Badges
// ------------------------
function updateBadges(){
  badgeList.innerHTML="";
  badges.forEach(b=>{
    const div=document.createElement("div");
    div.className="badge";
    div.innerText=b;
    badgeList.appendChild(div);
  });
}

// ------------------------
// Navigation
// ------------------------
function nextLesson(){i++;showLesson();}
function prevLesson(){i--;if(i<0)i=0;showLesson();}
function resetProgress(){i=0;totalXP=0;totalCorrect=0;badges=[];streak=0;localStorage.clear();updateBadges();showLesson();}

// ------------------------
// Show Progress Summary
// ------------------------
function showSummary(){
  summaryXP.innerText=`XP: ${totalXP}`;
  summaryCorrect.innerText=`Correct Quizzes: ${totalCorrect}/${lessons.length}`;
  summaryBadges.innerText=`Badges: ${badges.join(", ")}`;
  summaryStreak.innerText=`Streak: ${streak} days`;
}

// ------------------------
// Init
// ------------------------
updateBadges();
showLesson();