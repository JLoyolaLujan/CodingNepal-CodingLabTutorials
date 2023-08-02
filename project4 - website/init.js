const formOpenBtn = document.querySelector("#form_open"),
    home = document.querySelector(".home"), 
    formContainer = document.querySelector(".form_container"),
    formCloseBtn = document.querySelector(".close"), 
    signupBtn = document.querySelector("#signup"),
    loginBtn = document.querySelector("#login"), 
    pwShowHide = document.querySelectorAll(".visoff"); 

/*to open form*/
formOpenBtn.addEventListener("click", () => home.classList.add("show")); 
formCloseBtn.addEventListener("click", () => home.classList.remove("show")); 

/*to show or hide password*/
pwShowHide.forEach((icon) => {
    icon.addEventListener("click", () => {
        let getPwInput = icon.parentElement.querySelector("input"); 
        if(getPwInput.type === "password") {
            getPwInput.type = "text"; 
            icon.src = `icons/visibility_FILL0_wght400_GRAD0_opsz48.svg`; 
        }
        else {
            getPwInput.type = "password"; 
            icon.src = `/icons/visibility_off_FILL0_wght400_GRAD0_opsz48.svg`;
        }
    }); 
}); 

/*to access the sign up form*/
signupBtn.addEventListener("click", (e) => {
    e.preventDefault(); 
    formContainer.classList.add("active"); 
});

/*to go back to the login form*/
loginBtn.addEventListener("click", (e) => {
    e.preventDefault(); 
    formContainer.classList.remove("active");
}); 