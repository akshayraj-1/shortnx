const email = document.getElementById("email");
const password = document.getElementById("password");
const btnLogin = document.getElementById("btnLogin");
const toast = new Toast();

btnLogin.addEventListener("click", async () => {
    try {

    } catch (error) {
        toast.showToast(error.message, toast.types.error);
    } finally {
        
    }
});