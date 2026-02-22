history.pushState(null, null, location.href);
window.onpopstate = function () {
    history.go(1);
};
const signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        const nameRegex = /^[A-Za-z]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            alert("All fields are required");
            return;
        }

        if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
            alert("Name must contain letters only");
            return;
        }

        if (!emailRegex.test(email)) {
            alert("Invalid email address");
            return;
        }

        if (password.length < 8) {
            alert("Password must be at least 8 characters");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        let users = JSON.parse(localStorage.getItem("users")) || [];

        // check if email already exists
        const emailExists = users.some(user => user.email === email);

        if (emailExists) {
            alert("Email already registered");
            return;
        }

        // push new user
        users.push({
            firstName,
            lastName,
            email,
            password
        });

        localStorage.setItem("users", JSON.stringify(users));

        alert("Registration successful!");
        window.location.href = "login.html";
    });
}
