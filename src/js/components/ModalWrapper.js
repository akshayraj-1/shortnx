class ModalWrapper {
    #styles = {
        backdrop: {
            default: ["modal-backdrop", "hidden", "outline-none"],
            show: ["animate-fade-in", "flex", "justify-center", "items-center", "outline-none"],
            hide: ["animate-fade-out", "hidden"],
        },
        wrapper: {
            default: ["flex", "justify-center", "items-center", "size-full", "outline-none"],
            show: ["animate-pop-up"],
            hide: ["animate-pop-down"]
        }
    };

    constructor(children) {
        if (!children || !children instanceof Node) {
            throw new Error("Invalid children provided");
        }

        this._elements = {
            backdrop: document.createElement("div"),
            wrapper: document.createElement("div"),
            modal: children
        };

        // Set classes
        this._elements.backdrop.className = this.#styles.backdrop.default.join(" ");
        this._elements.wrapper.className = this.#styles.wrapper.default.join(" ");

        // Set attributes
        this._elements.backdrop.setAttribute("role", "dialog");
        this._elements.backdrop.setAttribute("tabindex", "-1");
        this._elements.backdrop.setAttribute("aria-hidden", "true");

        this._elements.wrapper.setAttribute("role", "dialog");
        this._elements.wrapper.setAttribute("tabindex", "-1");
        this._elements.wrapper.setAttribute("aria-modal", "true");
        this._elements.wrapper.setAttribute("aria-hidden", "true");

        // Append to the DOM
        this._elements.wrapper.appendChild(this._elements.modal);
        this._elements.backdrop.appendChild(this._elements.wrapper);
        document.body.prepend(this._elements.backdrop);
    }

    /**
     *
     * @param {boolean} cancellable - Cancel on click outside
     * @param {EventBus|null} eventbus - Event bus to emit events
     * @param {string|null} eventname - Event name to emit
     */
    show(cancellable = false, eventbus = null, eventname = null) {

        this._elements.backdrop.removeAttribute("aria-hidden");
        this._elements.wrapper.removeAttribute("aria-hidden");

        this._elements.backdrop.classList.remove(...this.#styles.backdrop.hide);
        this._elements.backdrop.classList.add(...this.#styles.backdrop.show);

        this._elements.wrapper.classList.remove(...this.#styles.wrapper.hide);
        this._elements.wrapper.classList.add(...this.#styles.wrapper.show);

        setTimeout(() => {
            this._elements.wrapper.focus();
            document.body.style.overflow = "hidden";
            if (eventbus && eventname) eventbus.emit(eventname);
        }, 0);
    }

    /**
     *
     * @param {EventBus|null} eventbus - Event bus to emit events
     * @param {string|null} eventname - Event name to emit
     */
    hide(eventbus = null, eventname = null) {
        this._elements.backdrop.setAttribute("aria-hidden", "true");
        this._elements.wrapper.setAttribute("aria-hidden", "true");

        this._elements.wrapper.classList.remove(...this.#styles.wrapper.show);
        this._elements.wrapper.classList.add(...this.#styles.wrapper.hide);

        setTimeout(() => {
            this._elements.backdrop.classList.remove(...this.#styles.backdrop.show);
            this._elements.backdrop.classList.add(...this.#styles.backdrop.hide);
            document.body.style.overflow = "auto";
            if (eventbus && eventname) eventbus.emit(eventname);
        }, 300);
    }

}

export default ModalWrapper;