history.pushState(null, null, location.href);
window.onpopstate = function () {
     history.go(1);
 };

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || !currentUser.result) {
  window.location.replace("login.html");
}
  const avatarButton = document.getElementById('avatarButton');
const avatarDropdown = document.getElementById('avatarDropdown');
const LogoutBtn = document.getElementById('logbtnhome')
const studentid=document.getElementById("studentid")
  studentid.textContent = `Student #${currentUser.id}`;

avatarButton.addEventListener('click', () => {
    avatarDropdown.classList.toggle('hidden');
  });
const StudentNameAvtar = document.querySelector("#avatarButton");
const StudentName = document.querySelector("#StudentName");
if (StudentNameAvtar) {
        StudentNameAvtar.textContent=`${currentUser.firstName[0]}${currentUser.lastName[0]}`
        StudentName.textContent=`${currentUser.firstName} ${currentUser.lastName}`
        
    }

  // Close menu if click outside
  document.addEventListener('click', (e) => {
    if (!avatarButton.contains(e.target) && !avatarDropdown.contains(e.target)) {
      avatarDropdown.classList.add('hidden');
    }
  });

   LogoutBtn?.addEventListener("click", () => {
        location.replace("index.html");
    });

const data = currentUser.result;

document.getElementById("score").innerText =
  `Correct Answers: ${data.correct} / ${data.total}`;

document.getElementById("percentage").innerText =
  `Percentage: ${data.percentage}%`;

document.getElementById("attempts").innerText =
  `Attempts: ${currentUser.attempts}`;

const statusEl = document.getElementById("status");
statusEl.innerText = `Status: ${data.status}`;

if (data.status === "PASS") {
  statusEl.classList.add("text-green-600");
} else {
  statusEl.classList.add("text-red-600");
}

const container = document.createElement("div");
container.className = "mt-6 text-left";

if (data.wrongQuestions.length > 0) {
  container.innerHTML += "<h2 class='font-bold mb-3'>Wrong Questions:</h2>";

  data.wrongQuestions.forEach((q, index) => {
    container.innerHTML += `
      <div class="mb-4 p-4 border rounded-lg bg-slate-50 dark:bg-gray-800">
        <p class="font-semibold">${index + 1}) ${q.question}</p>
        <p class="text-red-600">Your Answer : ${q.userAnswer}</p>
        <p class="text-green-600">Correct Answer : ${q.correctAnswer}</p>
      </div>
    `;
  });

} else {
  container.innerHTML +=
    "<p class='text-green-600 font-bold'>Perfect Score! 🎉</p>";
}

document.querySelector("#wrong-questions").appendChild(container);

function goHome() {
  window.location.href = "home.html";
}

