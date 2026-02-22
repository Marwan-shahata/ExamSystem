// Dark Mode
const toggleBtn = document.getElementById("themeToggle");
const html = document.documentElement;
const icon = document.getElementById("themeIcon");
if (localStorage.getItem("theme") === "dark") {
  html.classList.add("dark");
  icon.classList.replace("fa-moon", "fa-sun");
}
toggleBtn.onclick = () => {
  html.classList.toggle("dark");
  if (html.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
    icon.classList.replace("fa-moon", "fa-sun");
  } else {
    localStorage.setItem("theme", "light");
    icon.classList.replace("fa-sun", "fa-moon");
  }
};