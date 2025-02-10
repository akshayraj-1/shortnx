class ModalWrapper {
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

        this._elements = {
            backdrop: document.createElement("div"),
            modalWrapper: document.createElement("div"),
            modal: children
        };

        // Set classes
        this._elements.backdrop.className = this.#styles.backdrop.default.join(" ");
        this._elements.modalWrapper.className = this.#styles.modalWrapper.default.join(" ");

        // Set attributes
        this._elements.backdrop.setAttribute("role", "dialog");
        this._elements.backdrop.setAttribute("tabindex", "-1");
        this._elements.backdrop.setAttribute("aria-hidden", "true");

        this._elements.modalWrapper.setAttribute("role", "dialog");
        this._elements.modalWrapper.setAttribute("tabindex", "-1");
        this._elements.modalWrapper.setAttribute("aria-modal", "true");
        this._elements.modalWrapper.setAttribute("aria-hidden", "true");

        // Append to the DOM
        this._elements.modalWrapper.appendChild(this._elements.modal);
        this._elements.backdrop.appendChild(this._elements.modalWrapper);
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
        this._elements.modalWrapper.removeAttribute("aria-hidden");

        this._elements.backdrop.classList.remove(...this.#styles.backdrop.hide);
        this._elements.backdrop.classList.add(...this.#styles.backdrop.show);

        this._elements.modalWrapper.classList.remove(...this.#styles.modalWrapper.hide);
        this._elements.modalWrapper.classList.add(...this.#styles.modalWrapper.show);

        setTimeout(() => {
            this._elements.modalWrapper.focus();
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
        this._elements.modalWrapper.setAttribute("aria-hidden", "true");

        this._elements.modalWrapper.classList.remove(...this.#styles.modalWrapper.show);
        this._elements.modalWrapper.classList.add(...this.#styles.modalWrapper.hide);

        setTimeout(() => {
            this._elements.backdrop.classList.remove(...this.#styles.backdrop.show);
            this._elements.backdrop.classList.add(...this.#styles.backdrop.hide);
            document.body.style.overflow = "auto";
            if (eventbus && eventname) eventbus.emit(eventname);
        }, 300);
    }


    // Helper function to toggle button state
    _toggleBtnState(btn, enabled, loading = false) {
        btn.disabled = !enabled;
        if (!enabled && loading) {
            btn.style.color = "transparent";
            let loader = btn.querySelector(".dot-loader");
            if (!loader) {
                loader = document.createElement("div");
                loader.classList.add("dot-loader", "absolute", "top-1/2", "left-1/2", "-translate-y-1/2", "-translate-x-1/2");
                loader.style.width = "32px";
                btn.prepend(loader);
            }
        } else {
            btn.style.color = "#fff";
            const loader = btn.querySelector(".dot-loader");
            if (loader) btn.removeChild(loader);
        }
    }

}

export default ModalWrapper;