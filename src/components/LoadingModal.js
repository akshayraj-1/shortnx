/**
 * @description
 * This class is used to display loading animation over the entire page
 */

class LoadingModal {
    #backdrop;
    #loader;

    constructor() {
        this.#backdrop = document.createElement("div");
        this.#backdrop.className = `modal-backdrop hidden`;
        this.#loader = document.createElement("div");
        this.#loader.innerHTML = '<div class="loader"></div>';
        this.#backdrop.appendChild(this.#loader);
        document.body.prepend(this.#backdrop);
    }

    show() {
        this.#backdrop.classList.remove("hidden", "animate-fade-out");
        this.#backdrop.classList.add("animate-fade-in", "flex", "justify-center", "items-center");
        document.body.style.overflow = "hidden";
    }

    hide() {
        this.#backdrop.classList.remove("animate-fade-in");
        this.#backdrop.classList.add("animate-fade-out");
        setTimeout(() => {
            this.#backdrop.classList.remove("flex", "justify-center", "items-center");
            this.#backdrop.classList.add("hidden");
            document.body.style.overflow = "auto";
        }, 300);
    }
}