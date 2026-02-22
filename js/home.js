history.pushState(null, null, location.href);
window.onpopstate = function () {
    history.go(1);
};
document.addEventListener("DOMContentLoaded", () => {
    const studentNameDisplay = document.querySelector("#student-name");
    const startBtnExam = document.querySelector("#BTn-star");
    const examModalStart = document.querySelector("#my_modal_5");
    const examModalCompleted = document.querySelector("#my_modal_4");
    const confirmStartBtn = document.getElementById("confirmStartExam");
    const cancelStartBtn = document.getElementById("cancelExam");
    const cancelResultBtn = document.getElementById("cancel1Exam");
    const dateOfSub = document.getElementById("date-ofsub");
    const resultExamBtn = document.getElementById("ResultExam");

    const avatarButton = document.getElementById("avatarButton");
    const avatarDropdown = document.getElementById("avatarDropdown");
    const logoutBtn = document.getElementById("logout_btn");

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const timesubating = localStorage.getItem("timesubating") || '';
const StudentNameAvtar = document.querySelector("#avatarButton");
const StudentName = document.querySelector("#StudentName");
    const studentid=document.getElementById("studentid")
    studentid.textContent = `Student #${currentUser.id}`;
    if (!currentUser) {
        location.replace("login.html");
        return;
    }

    if (studentNameDisplay) {
        studentNameDisplay.textContent = `Welcome, ${currentUser.firstName} ${currentUser.lastName}!`;
    }

if (StudentNameAvtar) {
        StudentNameAvtar.textContent=`${currentUser.firstName[0]}${currentUser.lastName[0]}`
        StudentName.textContent=`${currentUser.firstName} ${currentUser.lastName}`
        
    }
   
    if (dateOfSub) {
        const date = new Date(timesubating);

    const formattedDate = date.toLocaleString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true 
    });

    dateOfSub.textContent = `Time Of Submit: ${formattedDate}`;
    } else {
    dateOfSub.textContent = "Time Of Submit: N/A";
    }

    avatarButton?.addEventListener("click", () => {
        avatarDropdown?.classList.toggle("hidden");
    });

    if (startBtnExam) {
        startBtnExam.addEventListener("click", () => {
            if (currentUser.examCompleted) {
                examModalCompleted?.showModal();
            } else {
                examModalStart?.showModal();
            }
        });
    }

    confirmStartBtn?.addEventListener("click", () => {
        localStorage.removeItem("shuffledQuestions");
        location.replace("exam.html");
    });

    resultExamBtn?.addEventListener("click", () => {
        location.replace("score.html");
    });

    cancelStartBtn?.addEventListener("click", () => {
        examModalStart?.close();
    });

    cancelResultBtn?.addEventListener("click", () => {
        examModalCompleted?.close();
    });

    logoutBtn?.addEventListener("click", () => {
        localStorage.removeItem("currentUser");
        location.replace("index.html");
    });

});
