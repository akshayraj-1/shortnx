export default class ModalWrapper {
    #elements;
    #styles = {
        backdrop: {
            default: ["modal-backdrop", "hidden", "py-10", "sm:px-6", "outline-none"],
            show: ["animate-fade-in", "flex", "justify-center", "items-center", "outline-none"],
            hide: ["animate-fade-out", "hidden"],
        },
        modalWrapper: {
            default: ["flex", "justify-center", "items-center", "size-full", "outline-none"],
            show: ["animate-pop-up"],
            hide: ["animate-pop-down"]
        }
    };

    constructor(children) {
        if (!children || !children instanceof Node) {
            throw new Error("Invalid children provided");
        }
        this.#elements = {
            backdrop: document.createElement("div"),
            modalWrapper: document.createElement("div")
        };

        // Set classes
        this.#elements.backdrop.className = this.#styles.backdrop.default.join(" ");
        this.#elements.modalWrapper.className = this.#styles.modalWrapper.default.join(" ");

        // Set attributes
        this.#elements.backdrop.setAttribute("role", "dialog");
        this.#elements.backdrop.setAttribute("tabindex", "-1");
        this.#elements.backdrop.setAttribute("aria-hidden", "true");

        this.#elements.modalWrapper.setAttribute("role", "dialog");
        this.#elements.modalWrapper.setAttribute("tabindex", "-1");
        this.#elements.modalWrapper.setAttribute("aria-modal", "true");
        this.#elements.modalWrapper.setAttribute("aria-hidden", "true");

        // Append to the DOM
        this.#elements.modalWrapper.appendChild(children);
        this.#elements.backdrop.appendChild(this.#elements.modalWrapper);
        document.body.prepend(this.#elements.backdrop);
    }

    show(cancellable = false, callback = () => {}) {

        this.#elements.backdrop.removeAttribute("aria-hidden");
        this.#elements.modalWrapper.removeAttribute("aria-hidden");

        this.#elements.backdrop.classList.remove(...this.#styles.backdrop.hide);
        this.#elements.backdrop.classList.add(...this.#styles.backdrop.show);

        this.#elements.modalWrapper.classList.remove(...this.#styles.modalWrapper.hide);
        this.#elements.modalWrapper.classList.add(...this.#styles.modalWrapper.show);

        setTimeout(() => {
            this.#elements.modalWrapper.focus();
            document.body.style.overflow = "hidden";
            callback();
        }, 0);
    }

    hide(callback = () => {}) {
        this.#elements.backdrop.setAttribute("aria-hidden", "true");
        this.#elements.modalWrapper.setAttribute("aria-hidden", "true");

        this.#elements.modalWrapper.classList.remove(...this.#styles.modalWrapper.show);
        this.#elements.modalWrapper.classList.add(...this.#styles.modalWrapper.hide);

        setTimeout(() => {
            this.#elements.backdrop.classList.remove(...this.#styles.backdrop.show);
            this.#elements.backdrop.classList.add(...this.#styles.backdrop.hide);
            document.body.style.overflow = "auto";
            callback();
        }, 300);
    }
}