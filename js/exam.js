
history.pushState(null, null, location.href);
window.onpopstate = function () {
    history.go(1);
};

var currentUser = JSON.parse(localStorage.getItem("currentUser"));
var shuffledQuestions = JSON.parse(localStorage.getItem("shuffledQuestions"));

if (!currentUser) {
    location.replace("login.html");
}

if (currentUser.examCompleted) {
    location.replace("score.html");
}

const StudentNameAvtar = document.querySelector("#avatarButton");
const StudentName = document.querySelector("#StudentName");
if (StudentNameAvtar) {
    StudentNameAvtar.textContent=`${currentUser.firstName[0]}${currentUser.lastName[0]}`
    StudentName.textContent=`${currentUser.firstName} ${currentUser.lastName}`
}

const questions = [
    { id: 1, text: "Which of the following methods can be used to display data in some form using JavaScript?", options: ["document.write()", "window.alert()", "console.log()", "All of the above"], answer: 3 },
    { id: 2, text: "How do you create a function in JavaScript?", options: ["function myFunction()", "function:myFunction()", "function = myFunction()", "create myFunction()"], answer: 0 },
    { id: 3, text: "How do you write an 'if' statement in JavaScript?", options: ["if i = 5 then", "if i == 5 then", "if (i == 5)", "if i = 5"], answer: 2 },
    { id: 4, text: "Which operator is used to assign a value to a variable?", options: ["*", "x", "=", "-"], answer: 2 },
    { id: 5, text: "What is the correct way to write a JavaScript array?", options: ["var colors = 1 = ('red'), 2 = ('green')", "var colors = ['red', 'green', 'blue']", "var colors = 'red', 'green', 'blue'", "var colors = (1:'red', 2:'green')"], answer: 1 },
    { id: 6, text: "Which event occurs when the user clicks on an HTML element?", options: ["onmouseclick", "onchange", "onmouseover", "onclick"], answer: 3 },
    { id: 7, text: "How do you declare a JavaScript variable?", options: ["v carName;", "variable carName;", "var carName;", "set carName;"], answer: 2 },
    { id: 8, text: "Which symbol is used for comments in JavaScript?", options: ["//", "??", "/*", "#"], answer: 0 },
    { id: 9, text: "What is the correct way to check if 'i' is NOT equal to 5?", options: ["if (i <> 5)", "if (i != 5)", "if i =! 5 then", "if i <> 5"], answer: 1 },
    { id: 10, text: "Which JavaScript method is used to select an HTML element by its id?", options: ["getElementById()", "getElementByClass()", "querySelector()", "None of the above"], answer: 0 }
];

// ================== Avatar Dropdown ==================
const avatarButton = document.getElementById('avatarButton');
const avatarDropdown = document.getElementById('avatarDropdown');
const LogoutBtn = document.getElementById('logbtnhome');

avatarButton.addEventListener('click', () => {
    avatarDropdown.classList.toggle('hidden');
});

document.addEventListener('click', (e) => {
    if (!avatarButton.contains(e.target) && !avatarDropdown.contains(e.target)) {
      avatarDropdown.classList.add('hidden');
    }
});

LogoutBtn?.addEventListener("click", () => {
    location.replace("home.html");
});

if (!shuffledQuestions) {
    shuffleArray(questions);
    shuffledQuestions = questions;
    localStorage.setItem("shuffledQuestions", JSON.stringify(shuffledQuestions));
}

const questionsToUse = shuffledQuestions;
var currentIdx = 0;
var userAnswers = new Array(questionsToUse.length).fill(null);
var flaggedQuestions = new Array(questions.length).fill(false);
// ================== Attempt & Timer Control ==================
const examDuration = 10 * 60; // 10 minutes // change time only for test 30sec

let attemptId = localStorage.getItem("attemptId");
let savedTime = parseInt(localStorage.getItem("timeLeft"));

if (!attemptId) {
    attemptId = Date.now().toString();
    localStorage.setItem("attemptId", attemptId);
    localStorage.setItem("timeLeft", examDuration);
    localStorage.setItem("cheatingCount", 0);

    savedTime = examDuration;
}

var timeLeft = savedTime;

// ================== UI ==================
var questionText = document.getElementById('question-text');
var optionsContainer = document.getElementById('options-container');
var qNumLabel = document.getElementById('question-number-label');
var nextBtn = document.getElementById('next-btn');
var prevBtn = document.getElementById('prev-btn');
var flagvBtn = document.getElementById('flag-btn');
var qMapContainer = document.getElementById('question-map');
var timerDisplay = document.getElementById('timer');
var timericon = document.getElementById('alarmicon');
const studentid = document.getElementById("studentid")
// ================== id student ==================

studentid.textContent = `Student #${currentUser.id}`;

// ================== Functions ==================
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


// ================== Sound System ==================
function playSound(type) {
    const sounds = {
        submit: document.getElementById("sound-submit"),
        warning: document.getElementById("sound-warning"),
        cheat: document.getElementById("sound-cheat"),
        timeup: document.getElementById("sound-timeup")
    };

    const audio = sounds[type];
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
    }
}

// ================== Toast ==================

function showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    
    const toast = document.createElement("div");

    let bgColor = "";
    if (type === "success") bgColor = "bg-emerald-500";
    if (type === "error") bgColor = "bg-red-500";
    if (type === "warning") bgColor = "bg-orange-500";

    toast.className = `
        ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg 
        text-center font-semibold max-w-sm w-full
        transform scale-90 opacity-0
        transition-all duration-300 pointer-events-auto
    `;

    toast.innerText = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove("scale-90", "opacity-0");
        toast.classList.add("scale-100", "opacity-100");
    }, 100);

    setTimeout(() => {
        toast.classList.add("scale-90", "opacity-0");
        setTimeout(() => toast.remove(), 500);
    }, 2000);
}

function initQuiz() {
    renderQuestion();
    renderMap();
    startTimer();
}

// ================== Render Question ==================
function renderQuestion() {
    const q = questionsToUse[currentIdx]; 
    qNumLabel.innerText = `Question ${currentIdx + 1} of ${questionsToUse.length}`;
    questionText.innerText = q.text;

    optionsContainer.innerHTML = '';
    q.options.forEach((opt, index) => {
        var isChecked = userAnswers[currentIdx] === index;
        var div = document.createElement('div');
        div.className = `flex items-center p-4 border rounded-lg cursor-pointer transition 
            ${isChecked 
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900 dark:border-indigo-400' 
                : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700'} 
        `;
        div.innerHTML = `
            <input type="radio" name="option" class="w-4 h-4 text-indigo-600" ${isChecked ? 'checked' : ''}>
            <span class="ml-4 font-medium">${opt}</span>
        `;
        div.onclick = () => selectOption(index);
        optionsContainer.appendChild(div);
    });

    prevBtn.disabled = currentIdx === 0;
    prevBtn.style.opacity = currentIdx === 0 ? '0.5' : '1';
    nextBtn.innerText = currentIdx === questionsToUse.length - 1 ? 'Last' : 'Next →';
}

function selectOption(index) {
    userAnswers[currentIdx] = index;
    renderQuestion();
    renderMap();
}

function renderMap() {
    qMapContainer.innerHTML = '';

    questionsToUse.forEach((_, i) => {
        var btn = document.createElement('div');
        var statusClass = "";

        if (flaggedQuestions[i] === true) {
            statusClass = 'bg-[#ff9137] text-white';
        }
        else if (i === currentIdx) {
            statusClass = 'bg-indigo-600 text-white';
        }
        else if (userAnswers[i] !== null) {
            statusClass = 'bg-emerald-500 text-white';
        }
        else {
            statusClass = 'bg-slate-200 text-slate-500';
        }

        btn.className = `w-10 h-10 flex items-center justify-center rounded-lg text-xs font-bold cursor-pointer transition ${statusClass}`;
        btn.innerText = i + 1;
        btn.onclick = () => {
            currentIdx = i;
            renderQuestion();
            renderMap();
        };

        qMapContainer.appendChild(btn);
    });
}

flagvBtn.onclick = () => {
    flaggedQuestions[currentIdx] = !flaggedQuestions[currentIdx]; 
    renderMap();
};

// ================== Timer ==================
function startTimer() {
    var interval = setInterval(() => {

        var mins = Math.floor(timeLeft / 60);
        var secs = timeLeft % 60;

        timerDisplay.innerText =
            `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

        localStorage.setItem("timeLeft", timeLeft);

        if (timeLeft <= 0) {
            clearInterval(interval);

            playSound("timeup");
            showToast("⏰ Time's up!", "warning");

            setTimeout(() => {
                submitExam();
            }, 2500);

            return;
        }

        if (timeLeft <= 5 * 60) {
            timerDisplay.classList.add("text-red-600", "animate-bounce");
            timericon.classList.add("text-red-600", "animate-bounce");
        } else {
            timerDisplay.classList.remove("text-red-600", "animate-bounce");
            timericon.classList.remove("text-red-600", "animate-bounce");
        }

        timeLeft--;

    }, 1000);
}

// ================== Submit Exam ==================
function submitExam() {

    if (window.examSubmitting) return;
    window.examSubmitting = true;

    let timesubating = new Date();
    localStorage.setItem("timesubating", timesubating);

    var correct = 0;
    var wrongQuestions = [];

    questionsToUse.forEach((q, index) => {
        if (userAnswers[index] === q.answer) {
            correct++;
        } else {
            wrongQuestions.push({
                question: q.text,
                correctAnswer: q.options[q.answer],
                userAnswer: userAnswers[index] !== null
                    ? q.options[userAnswers[index]]
                    : "Not Answered"
            });
        }
    });

    var total = questionsToUse.length;
    var percentage = total > 0
        ? Math.round((correct / total) * 100)
        : 0;

    var resultData = {
        correct,
        total,
        percentage,
        status: percentage >= 50 ? "PASS" : "FAIL",
        wrongQuestions,
        time: examDuration - timeLeft
    };

    var users = JSON.parse(localStorage.getItem("users")) || [];
    var currentUser = JSON.parse(localStorage.getItem("currentUser"));
    var userIndex = users.findIndex(
        user => user.email === currentUser.email
    );

    if (userIndex !== -1) {

        users[userIndex].examCompleted = true;
        users[userIndex].attempts =
            (users[userIndex].attempts || 0) + 1;

        users[userIndex].result = resultData;

        localStorage.setItem(
            "currentUser",
            JSON.stringify(users[userIndex])
        );

        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );
    }

    playSound("submit");
    showToast("✅ Exam submitted successfully!", "success");

    localStorage.removeItem("attemptId");
    localStorage.removeItem("timeLeft");
    localStorage.removeItem("cheatingCount");

    setTimeout(() => {
        window.location.replace("score.html");
    }, 2000);
}

nextBtn.onclick = () => {
    if (currentIdx < questions.length - 1) {
        currentIdx++;
        renderQuestion();
        renderMap();
    }
};

prevBtn.onclick = () => {
    if (currentIdx > 0) {
        currentIdx--;
        renderQuestion();
        renderMap();
    }
};

document.getElementById('submit-exam').onclick = submitExam;
// // ================== Cheating Detection ==================
let cheatingCount = parseInt(localStorage.getItem("cheatingCount")) || 0;
const maxCheatingAttempts = 3;

let lastCheatTime = 0; 

function countCheating(reason) {

    const now = Date.now();

    if (now - lastCheatTime < 1000) return;

    lastCheatTime = now;

    cheatingCount++;
    localStorage.setItem("cheatingCount", cheatingCount);

    playSound("cheat");
    showToast(`⚠ Cheating detected: ${reason} (${cheatingCount}/${maxCheatingAttempts})`, "error");

    if (cheatingCount >= maxCheatingAttempts) {
        showToast("❌ Exam terminated due to cheating!", "error");

        setTimeout(() => {
            cheatingCount = 0;
            localStorage.removeItem("cheatingCount");
            submitExam();
        }, 2500);
    }
}


// ================== Tab & Focus Detection ==================

document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        countCheating("Tab switch");
    }
});

window.addEventListener("blur", () => {
    if (document.visibilityState === "visible") {
        countCheating("Window focus lost");
    }
});

function warnOnly(reason) {
    playSound("warning");
    showToast(`⚠ Action blocked: ${reason}`, "warning");
}


// ==================  COUNT  ==================

// Tab Switch
document.addEventListener("visibilitychange", () => {
    if (document.hidden) countCheating("Tab switch");
});

// Window blur
window.addEventListener("blur", () => {
    countCheating("Window focus lost");
});


// ==================  Warning  ==================

// Right click
document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    warnOnly("Right click blocked");
});

// Copy
document.addEventListener("copy", (e) => {
    e.preventDefault();
    warnOnly("Copy attempt blocked");
});

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
    if (e.key === "F12") {
        e.preventDefault();
        warnOnly("DevTools blocked");
    }

    if (e.ctrlKey && e.shiftKey && e.key === "I") {
        e.preventDefault();
        warnOnly("DevTools shortcut blocked");
    }

    if (e.ctrlKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        warnOnly("Copy shortcut blocked");
    }
});

initQuiz();




