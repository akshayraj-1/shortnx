const inputUrl = document.querySelector("#input-url");
const spinner = document.querySelector("[aria-label='spinner']");
const arrowRight = document.querySelector("[aria-label='arrow-right']");
const btnShorten = document.querySelector("#btn-shorten");
const modal = new ShareModal();
const toast = new Toast();

btnShorten.addEventListener("click", async () => {
    try {
        const url = inputUrl.value;
        if (!url) return;

        spinner.classList.toggle("hidden", false);
        arrowRight.classList.toggle("hidden", true);
        btnShorten.disabled = true;

        const response = await fetch("/api/short-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url })
        });
        const data = await response.json();

        if (!data.success) throw new Error(data.message);

        inputUrl.value = "";
        modal.showModal(data.data.shortenUrl);

    } catch (error) {
        toast.showToast(error.message, toast.types.error);
    } finally {
        spinner.classList.toggle("hidden", true);
        arrowRight.classList.toggle("hidden", false);
        btnShorten.disabled = false;
    }
});