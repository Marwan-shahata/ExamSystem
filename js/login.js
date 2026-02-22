history.pushState(null, null, location.href);
window.onpopstate = function () { history.go(1); };

// Eye toggle
function togglePassword(inputId, buttonId) {
  const input = document.getElementById(inputId);
  const button = document.getElementById(buttonId);
  const icon = button.querySelector("i");
  button.addEventListener("click", () => {
    if (input.type === "password") {
      input.type = "text";
      icon.classList.replace("fa-eye", "fa-eye-slash");
    } else {
      input.type = "password";
      icon.classList.replace("fa-eye-slash", "fa-eye");
    }
  });
}
togglePassword("password", "toggleSignupPassword");
togglePassword("confirmPassword", "toggleConfirmPassword");
togglePassword("loginPassword", "toggleLoginPassword");

// Switch forms
const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");
const successMessage = document.getElementById("successMessage");
document.getElementById("toSignin").onclick = () => {
  signupForm.classList.add("opacity-0","scale-95","pointer-events-none");
  loginForm.classList.remove("opacity-0","scale-95","pointer-events-none");
};
document.getElementById("toSignup").onclick = () => {
  loginForm.classList.add("opacity-0","scale-95","pointer-events-none");
  signupForm.classList.remove("opacity-0","scale-95","pointer-events-none");
};
document.getElementById("goToSignIn").onclick = () => {
  successMessage.classList.add("opacity-0","scale-95","pointer-events-none");
  loginForm.classList.remove("opacity-0","scale-95","pointer-events-none");
};

// Toast function
function showToast(message, type = "error") {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = `max-w-xs w-full px-4 py-3 rounded-xl shadow-lg text-white ${type==="error"?"bg-red-500":"bg-green-500"} transform transition-all duration-300 opacity-0 translate-x-20`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => { toast.classList.remove("opacity-0","translate-x-20"); }, 50);
  setTimeout(() => { toast.classList.add("opacity-0","translate-x-20"); setTimeout(()=>toast.remove(),300); }, 3000);
}

// Validation
function validateName(value) { return /^[A-Za-z]+$/.test(value.trim()); }
function validateEmail(value) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()); }
function validatePassword(value) { return value.length >= 8 && /\d/.test(value); }
function validateConfirmPassword(pw, cpw) { return pw === cpw && cpw.length>0; }

function updateInput(input,errorEl,isValid,message){
  if(input.value.trim()===""){input.classList.remove("border-red-400","border-green-400"); errorEl.classList.add("hidden");}
  else if(isValid){input.classList.remove("border-red-400"); input.classList.add("border-green-400"); errorEl.classList.add("hidden");}
  else{input.classList.remove("border-green-400"); input.classList.add("border-red-400"); errorEl.textContent=message; errorEl.classList.remove("hidden");}
}

// Sign Up Validation
const signupFields = [
  {input:"firstName",error:"firstNameError",validator:validateName,message:"First name letters only"},
  {input:"lastName",error:"lastNameError",validator:validateName,message:"Last name letters only"},
  {input:"email",error:"emailError",validator:validateEmail,message:"Invalid email"},
  {input:"password",error:"passwordError",validator:validatePassword,message:"Password min 8 chars and numbers"},
  {input:"confirmPassword",error:"confirmPasswordError",validator:(v)=>validateConfirmPassword(document.getElementById("password").value,v),message:"Passwords do not match"},
];
signupFields.forEach(f=>{
  const input=document.getElementById(f.input);
  const errorEl=document.getElementById(f.error);
  input.addEventListener("input",()=>updateInput(input,errorEl,f.validator(input.value),f.message));
});

// Sign In Validation
const loginFields = [
  {input:"loginEmail",error:"loginEmailError",validator:validateEmail,message:"Invalid email"},
  {input:"loginPassword",error:"loginPasswordError",validator:validatePassword,message:"Password min 8 chars and numbers"},
];
loginFields.forEach(f=>{
  const input=document.getElementById(f.input);
  const errorEl=document.getElementById(f.error);
  input.addEventListener("input",()=>updateInput(input,errorEl,f.validator(input.value),f.message));
});

// Sign Up Submit
signupForm.addEventListener("submit",(e)=>{
  e.preventDefault();
  if(!signupFields.every(f=>f.validator(document.getElementById(f.input).value))){
    showToast("Please fix errors before submitting"); 
    return;
  }

  let users=JSON.parse(localStorage.getItem("users"))||[];
  const email=document.getElementById("email").value.trim();
  if(users.some(u=>u.email===email)){showToast("Email already registered"); return;}
  // Get student counter
let studentCounter = parseInt(localStorage.getItem("studentCounter")) || 0;
studentCounter++;
localStorage.setItem("studentCounter", studentCounter);

// Encrypt password

const password = document.getElementById("password").value;
const encryptedPassword = CryptoJS.SHA256(password).toString();

// Add user
users.push({
  id: studentCounter,
  firstName: document.getElementById("firstName").value.trim(),
  lastName: document.getElementById("lastName").value.trim(),
  email: email,
  password: encryptedPassword
});


  // users.push({
  //   firstName: document.getElementById("firstName").value.trim(),
  //   lastName: document.getElementById("lastName").value.trim(),
  //   email: email,
  //   password: encryptedPassword
  // });

  localStorage.setItem("users",JSON.stringify(users));
  signupForm.classList.add("opacity-0","scale-95","pointer-events-none");
  successMessage.classList.remove("opacity-0","scale-95","pointer-events-none");
  showToast("Registration Successful!","success");
});

// Sign In Submit
loginForm.addEventListener("submit",(e)=>{
  e.preventDefault();
  if(!loginFields.every(f=>f.validator(document.getElementById(f.input).value))){
    showToast("Please Complete all Data before submitting"); 
    return;
  }

  const email=document.getElementById("loginEmail").value.trim();
  const password=document.getElementById("loginPassword").value;
  const encryptedPassword = CryptoJS.SHA256(password).toString();

  const users=JSON.parse(localStorage.getItem("users"))||[];
  const user=users.find(u=>u.email===email && u.password===encryptedPassword);
  if(!user){showToast("Invalid email or password"); return;}

  localStorage.setItem("currentUser",JSON.stringify(user));
  showToast("Login Successful!","success");
  setTimeout(()=>window.location.href="home.html",800);
});