import Toast from "../components/Toast";
import ShareModal from "../components/ShareModal";
import { isURL } from "../../utils/validator.util";

window.toast = new Toast();
window.shareModal = new ShareModal();
const inputUrl = document.querySelector("#input-url");
const spinner = document.querySelector("[aria-label='spinner']");
const arrowRight = document.querySelector("[aria-label='arrow-right']");
const btnShorten = document.querySelector("#btn-shorten");

inputUrl.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        btnShorten.click();
    }
});

btnShorten.addEventListener("click", async () => {
    const url = inputUrl.value;

    if (!isURL(url, { restricted_hostnames: ["localhost:\\d*", window.location.hostname] })) {
        toast.showToast("Please enter a valid url");
        return;
    }

    spinner.classList.toggle("hidden", false);
    arrowRight.classList.toggle("hidden", true);
    btnShorten.disabled = true;

    try {
        const response = await fetch("/url/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ targetUrl: url })
        });
        const parsedResponse = await response.json();
        if (!parsedResponse.success) {
            toast.showToast(parsedResponse.message);
            return;
        }
        inputUrl.value = "";
        inputUrl.blur();
        shareModal.showModal(parsedResponse.data.shortenUrl);

    } catch (error) {
        toast.showToast(error.message);
    } finally {
        spinner.classList.toggle("hidden", true);
        arrowRight.classList.toggle("hidden", false);
        btnShorten.disabled = false;
    }
});


// animation
function animateOnVisible(target, animation, threshold = 0.3) {
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                gsap.to(entry.target, animation);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold });
    target.forEach(el => observer.observe(el));
}

animateOnVisible(document.querySelectorAll(".left-side"), {
    y: 0,
    opacity: 1,
    duration: 0.5,
    stagger: 0.1,
    ease: "easeInOut"
});

animateOnVisible(document.querySelectorAll(".right-side"), {
    y: 0,
    opacity: 1,
    duration: 0.5,
    ease: "easeInOut"
});

animateOnVisible(document.querySelectorAll(".feature-section"), {
    y: 0,
    opacity: 1,
    duration: 0.5,
    ease: "easeInOut"
}, 0.2);