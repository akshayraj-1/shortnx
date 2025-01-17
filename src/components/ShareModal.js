class ShareModal {
    #backdrop;
    #modal;
    #shortUrl;
    #closeOnEscape;

    #styles = {
        backdrop: {
            default: ["modal-backdrop", "hidden", "px-6"],
            show: ["animate-fade-in", "flex", "justify-center", "items-center"],
            hide: ["animate-fade-out", "hidden"],
        },
        modal: {
            default: ["flex", "flex-col", "w-full", "max-w-[400px]", "p-6", "md:p-8", "bg-colorSurface", "rounded-xl", "outline-none"],
            show: ["animate-pop-up"],
            hide: ["animate-pop-down"],
        },
        title: {
            default: ["text-lg", "sm:text-xl", "font-semibold"]
        },
        shortUrl: {
            default: ["w-full", "text-sm", "sm:text-base", "text-textPrimary", "overflow-ellipsis", "overflow-hidden"]
        },
        btnClose: {
            default: ["text-[1.5rem]", "text-textSecondary", "cursor-pointer", "icon-close-md"]
        },
        btnSocial: {
            default: ["p-5", "rounded-full", "ring-1", "ring-inset", "ring-slate-300", "cursor-pointer", "size-[4.5rem]"]
        },
        btnCopy: {
            default: ["absolute", "top-0", "right-0", "flex", "items-center", "justify-center", "h-full", "px-3", "bg-colorPrimary", "text-white", "cursor-pointer", "icon-copy-alt"]
        }
    };

    constructor() {
        this.#backdrop = document.createElement("div");
        this.#backdrop.className = this.#styles.backdrop.default.join(" ");
        this.#modal = document.createElement("div");
        this.#modal.className = this.#styles.modal.default.join(" ");
        this.#modal.setAttribute("aria-hidden", true);
        this.#modal.innerHTML = `
             <div class="flex items-center justify-between">
                    <h3 class="${this.#styles.title.default.join(" ")}">Your link is ready! 🎉</h3>
                    <button id="modal-share-btn-close" class="${this.#styles.btnClose.default.join(" ")}"></button>
                </div>
                <div class="flex items-center justify-evenly mt-8 gap-3">
                    <button class="${this.#styles.btnSocial.default.join(" ")}" data-action="whatsapp" title="Share on WhatsApp">
                        <img src="/images/whatsapp.svg" alt="Share on WhatsApp">
                    </button>
                    <button class="${this.#styles.btnSocial.default.join(" ")}" data-action="twitter" title="Share on X">
                        <img src="/images/twitter_alt.svg" alt="Share on Twitter">
                    </button>
                    <button class="${this.#styles.btnSocial.default.join(" ")}" data-action="email" title="Share via Email">
                        <img src="/images/envelope.svg" alt="Share via Email">
                    </button>
                </div>
                <div class="relative mt-8 mb-4 px-4 py-2.5 font-medium bg-colorSurfaceSecondary rounded-md ring-1 ring-inset ring-slate-300 overflow-hidden">
                    <span id="modal-share-short-url" class="${this.#styles.shortUrl.default.join(" ")}"></span>
                    <button id="modal-share-btn-copy" class="${this.#styles.btnCopy.default.join(" ")}" title="Copy URL" aria-label="Copy URL"></button>
                </div>
        `;

        this.#backdrop.appendChild(this.#modal);
        document.body.prepend(this.#backdrop);

        // Initialize the elements
        this.#shortUrl = document.getElementById("modal-share-short-url");
        this.#addEvents();
    }
    #addEvents() {
        document.getElementById("modal-share-btn-close")
            .addEventListener("click", () => this.hideModal());


        document.getElementById("modal-share-btn-copy")
            .addEventListener("click", () => {
                navigator.clipboard.writeText(this.#shortUrl.textContent).then(r => {
                    // Assuming the toast is already initialized
                    toast.showToast("Copied to clipboard", toast.types.success);
                });
        });

        document.querySelectorAll("[data-action]")
            .forEach(btn => {
                btn.addEventListener("click", () => {
                    switch (btn.getAttribute("data-action")) {
                        case "whatsapp":
                            window.open(`https://api.whatsapp.com/send?text=${this.#shortUrl.textContent}`);
                            break;
                        case "twitter":
                            window.open(`https://twitter.com/intent/tweet?text=${this.#shortUrl.textContent}`);
                            break;
                        case "email":
                            window.open(`mailto:?subject=Shorten URL&body=${this.#shortUrl.textContent}`);
                            break;
                    }
                });
            });

        this.#closeOnEscape = (e) => {
            if (e.key.toLowerCase() === "escape") this.hideModal();
        }

    }

    // TODO: Convert the dialog the bottom sheet style for mobile devices
    showModal(url) {
        this.#shortUrl.textContent = url;
        this.#backdrop.setAttribute("aria-hidden", "false");
        this.#modal.setAttribute("aria-modal", "true");
        this.#modal.setAttribute("role", "dialog");
        this.#modal.setAttribute("tabindex", "0");
        this.#backdrop.classList.remove(...this.#styles.backdrop.hide);
        this.#backdrop.classList.add(...this.#styles.backdrop.show);
        this.#modal.classList.remove(...this.#styles.modal.hide);
        this.#modal.classList.add(...this.#styles.modal.show);
        this.#modal.focus();
        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", this.#closeOnEscape);
    }
    hideModal() {
        this.#backdrop.setAttribute("aria-hidden", "true");
        this.#modal.setAttribute("aria-modal", "false");
        this.#modal.setAttribute("role", "dialog");
        this.#modal.setAttribute("tabindex", "-1");
        this.#modal.classList.remove(...this.#styles.modal.show);
        this.#modal.classList.add(...this.#styles.modal.hide);
        setTimeout(() => {
            this.#backdrop.classList.remove(...this.#styles.backdrop.show);
            this.#backdrop.classList.add(...this.#styles.backdrop.hide);
            document.body.style.overflow = "auto";
        }, 300);
        document.removeEventListener("keydown", this.#closeOnEscape);
    }
}