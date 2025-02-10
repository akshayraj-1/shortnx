import Toast from "../../components/Toast";
import LoadingModal from "../../components/LoadingModal";
import InputValidation from "../../helpers/InputValidation";

const name = document.getElementById("name");
const email = document.getElementById("email");
const password = document.getElementById("password");
const btnSignUp = document.getElementById("btn-signup");

[name, email, password].forEach(input => input.addEventListener("input", () => {
    if (input.value) {
        InputValidation.toggleErrorState(input);
    }
}));

password.addEventListener("keypress", (e) => e.key === "Enter" && btnSignUp.click());

btnSignUp.addEventListener("click", async () => {

    if (!InputValidation.validateName(name) ||
        !InputValidation.validateEmail(email) ||
        !InputValidation.validatePassword(password)
    ) return;

    const userData = {
        name: name.value,
        email: email.value,
        password: password.value
    };

    try {
        LoadingModal.getInstance().show();
        const response = await fetch("/auth/signup", {
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
            } else {
                Toast.getInstance().showToast(message);
            }
        }

    } catch (error) {
        Toast.getInstance().showToast("Something went wrong");
    } finally {
        LoadingModal.getInstance().hide();
    }
});