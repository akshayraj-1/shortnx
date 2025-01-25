/**
 * @description
 * This class is used to display loading animation over the entire page
 */

class LoadingModal {
    #backdrop;
    #loader;
    #styles = {
        backdrop: {
            default: ["modal-backdrop", "hidden"],
            show: ["animate-fade-in", "flex", "justify-center", "items-center"],
            hide: ["animate-fade-out", "hidden"],
        },
    };

    constructor() {
        this.#backdrop = document.createElement("div");
        this.#backdrop.className = this.#styles.backdrop.default.join(" ");
        this.#loader = document.createElement("div");
        this.#loader.innerHTML = '<div class="loader"></div>';
        this.#backdrop.appendChild(this.#loader);
        document.body.prepend(this.#backdrop);
    }

    show() {
        this.#backdrop.classList.remove(...this.#styles.backdrop.hide);
        this.#backdrop.classList.add(...this.#styles.backdrop.show);
        document.body.style.overflow = "hidden";
    }

    hide() {
        setTimeout(() => {
            this.#backdrop.classList.remove(...this.#styles.backdrop.show);
            this.#backdrop.classList.add(...this.#styles.backdrop.hide);
            document.body.style.overflow = "auto";
        }, 300);
    }
}