window.onload = function () {

    history.pushState(null, null, location.href);
    window.onpopstate = function () {
        history.go(1);
    };

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    console.log("Current User:", currentUser);

    if (!currentUser) {
        window.location.replace("login.html");
        return;
    }

    if (!currentUser.result) {
        currentUser.result = {
            total: 0,
            correct: 0,
            percentage: 0,
            status: "FAIL"
        };
    }

    const avatarButton = document.getElementById('avatarButton');
    const avatarDropdown = document.getElementById('avatarDropdown');
    const LogoutBtn = document.getElementById('logout_btn');
    const studentid = document.getElementById("studentid");
    const StudentNameAvtar = document.querySelector("#avatarButton");
    const StudentName = document.querySelector("#StudentName");

    studentid.textContent = `Student #${currentUser.id || "0000"}`;

    if (StudentNameAvtar && StudentName) {
        StudentNameAvtar.textContent =
            `${currentUser.firstName?.[0] || ""}${currentUser.lastName?.[0] || ""}`;

        StudentName.textContent =
            `${currentUser.firstName || ""} ${currentUser.lastName || ""}`;
    }

    avatarButton?.addEventListener('click', () => {
        avatarDropdown?.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
        if (
            avatarButton &&
            avatarDropdown &&
            !avatarButton.contains(e.target) &&
            !avatarDropdown.contains(e.target)
        ) {
            avatarDropdown.classList.add('hidden');
        }
    });

    LogoutBtn?.addEventListener("click", () => {
        localStorage.removeItem("currentUser");
        location.replace("index.html");
    });


    const timeInSeconds = Number(currentUser.result.time ?? 0);
    console.log("Time Value:", timeInSeconds);

    document.getElementById("timeSpent").textContent =
        "Time Spent: " + formatTime(timeInSeconds);


    const percentage = Number(currentUser.result.percentage ?? 0);
    const total = Number(currentUser.result.total ?? 0);
    const correct = Number(currentUser.result.correct ?? 0);
    const wrong = total - correct;

    const header = document.getElementById("resultHeader");
    const title = document.getElementById("resultTitle");
    const subtitle = document.getElementById("resultSubtitle");
    const scoreValue = document.getElementById("scoreValue");

    if (currentUser.result.status === "PASS") {

        header.className =
            "bg-gradient-to-r from-emerald-500 to-emerald-700 px-10 py-12 text-center";

        title.textContent = "🎉 Excellent!";
        subtitle.textContent = "You passed the exam successfully!";
        scoreValue.className =
            "text-6xl font-bold text-emerald-600";

    } else {

        header.className =
            "bg-gradient-to-r from-red-500 to-red-700 px-10 py-12 text-center";

        title.textContent = "😞 Not Quite!";
        subtitle.textContent = "You need to improve your score";
        scoreValue.className =
            "text-6xl font-bold text-red-600";
    }

    document.getElementById("totalQuestions").textContent = total;
    document.getElementById("correctAnswers").textContent = correct;
    document.getElementById("wrongAnswers").textContent = wrong;

    scoreValue.textContent = percentage + "%";

    // ==============================
    // فورمات الوقت
    // ==============================

    function formatTime(seconds) {
        seconds = Number(seconds) || 0;

        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;

        return String(mins).padStart(2, "0") + ":" +
               String(secs).padStart(2, "0");
    }

    // عرض الأسئلة
    window.showQuestions = function () {
        window.location.replace("previewQ.html");
    };
};