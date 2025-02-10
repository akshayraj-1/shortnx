import Toast from "../../components/Toast";
import LoadingModal from "../../components/LoadingModal";
import InputValidation from "../../helpers/InputValidation";

const email = document.getElementById("email");
const password = document.getElementById("password");
const btnLogin = document.getElementById("btn-login");

[email, password].forEach(input => input.addEventListener("input", () => {
    if (input.value) {
        InputValidation.toggleErrorState(input);
    }
}));

password.addEventListener("keypress", (e) => e.key === "Enter" && btnLogin.click());

btnLogin.addEventListener("click", async () => {

    if (!InputValidation.validateEmail(email) ||
        !InputValidation.validateInput(password, /^\S+$/, { error: "Please enter your password" })
    ) return;

    const userData = {
        email: email.value,
        password: password.value
    };

    try {
        LoadingModal.getInstance().show();
        const response = await fetch("/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });

        const result = await response.json();
        if (result.success) {
            window.location.replace("/user/dashboard");
        } else {
            const message = result.message || "Something went wrong";
            if (message.toLowerCase().includes("email")) {
                InputValidation.toggleErrorState(email, message);
            } else if (message.toLowerCase().includes("password")) {
                InputValidation.toggleErrorState(password, message);
            } else if (message.toLowerCase().includes("invalid credentials")) {
                InputValidation.toggleErrorState(email, message);
                InputValidation.toggleErrorState(password, message);
            } else {
                Toast.getInstance().showToast(message);
            }
        }

    } catch (error) {
        Toast.getInstance().showToast(error.message);
    } finally {
        LoadingModal.getInstance().hide();
    }
});