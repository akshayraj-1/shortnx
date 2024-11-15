const name = document.getElementById("name");
const email = document.getElementById("email");
const password = document.getElementById("password");
const btnSignUp = document.getElementById("btnSignUp");
const btnGoogleLogin = document.getElementById("btnGoogleLogin");
const toast = new Toast();

btnSignUp.addEventListener("click", async () => {

    if (!name.value) {
        name.focus();
        return;
    }
    if (!email.value) {
        email.focus();
        return;
    }
    if (!password.value) {
        password.focus();
        return;
    }

    const userData = {
        name: name.value,
        email: email.value,
        password: password.value
    };

    try {
        const response = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });

        const result = await response.json();

        console.log(result);


    } catch (error) {
        console.log(error);
        toast.showToast(error.message, toast.types.error);
    }
});