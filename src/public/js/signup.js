const name = document.getElementById("name");
const email = document.getElementById("email");
const password = document.getElementById("password");
const btnSignUp = document.getElementById("btnSignUp");
const btnGoogleLogin = document.getElementById("btnGoogleLogin");
const toast = new Toast();

btnSignUp.addEventListener("click", async () => {
    try {
        // Validate Input
        if (!name.value) {
            name.classList.add("bg-red-50", "border-red-300", "placeholder:text-red-300");
            return;
        }
        if (!email.value) {
            email.classList.add("bg-red-50", "border-red-300", "placeholder:text-red-300");
            return;
        }
        if (!password.value) {
            password.classList.add("bg-red-50", "border-red-300", "placeholder:text-red-300");
            return;
        }

        const userData = {
            name: name.value,
            email: email.value,
            password: password.value
        };

        const response = await fetch("/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        })


    } catch (error) {
        toast.showToast(error.message, toast.types.error);
    }
});