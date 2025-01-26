/**
 * @description
 * This class is used to display loading animation over the entire page
 */

class LoadingModal {
    #elements;
    #styles = {
        backdrop: {
            default: ["modal-backdrop", "hidden"],
            show: ["animate-fade-in", "flex", "justify-center", "items-center"],
            hide: ["animate-fade-out", "hidden"],
        },
    };

    constructor() {
        this.#elements = {};
        this.#elements.backdrop = document.createElement("div");
        this.#elements.loader = document.createElement("div");

        this.#elements.backdrop.className = this.#styles.backdrop.default.join(" ");
        this.#elements.loader.innerHTML = '<div class="loader"></div>';

        this.#elements.backdrop.appendChild(this.#elements.loader);
        document.body.prepend(this.#elements.backdrop);
    }

    show() {
        this.#elements.backdrop.classList.remove(...this.#styles.backdrop.hide);
        this.#elements.backdrop.classList.add(...this.#styles.backdrop.show);
        document.body.style.overflow = "hidden";
    }

    hide() {
        setTimeout(() => {
            this.#elements.backdrop.classList.remove(...this.#styles.backdrop.show);
            this.#elements.backdrop.classList.add(...this.#styles.backdrop.hide);
            document.body.style.overflow = "auto";
        }, 300);
    }
}

window.loadingModal = new LoadingModal();