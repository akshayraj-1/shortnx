import ModalWrapper from "./ModalWrapper";

/**
 * @type {ShareModal}
 *
 */
class ShareModal extends ModalWrapper {
    #styles = {
        modal: {
            default: ["flex", "flex-col", "w-full", "max-w-[400px]", "p-6", "md:p-8", "bg-colorSurface", "rounded-xl"],
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

        // Singleton
        if (window.__share_modal_instance__) return window.__share_modal_instance__;

        // Continue Setup
        super(document.createElement("div"));
        this._elements.modal.className = this.#styles.modal.default.join(" ");
        this._elements.modal.innerHTML = `
             <div class="flex items-center justify-between">
                    <h3 class="${this.#styles.title.default.join(" ")}">Your link is ready! 🎉</h3>
                    <button data-ms-btn-close class="${this.#styles.btnClose.default.join(" ")}"></button>
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
                    <span data-ms-short-url class="${this.#styles.shortUrl.default.join(" ")}"></span>
                    <button data-ms-btn-copy class="${this.#styles.btnCopy.default.join(" ")}" title="Copy URL" aria-label="Copy URL"></button>
                </div>
        `;
        this.#init();

        // Storing the instance because the webpack encloses the classes into a separate closure function,
        // so inorder to maintain the same instance, I am using window object
        window.__share_modal_instance__ = this;
    }

    static getInstance() {
        return window.__share_modal_instance__ || new ShareModal();
    }

    #init() {
        this._elements.shortUrl = this._elements.modal.querySelector("[data-ms-short-url]");
        this._elements.btnClose = this._elements.modal.querySelector("[data-ms-btn-close]");
        this._elements.btnCopy = this._elements.modal.querySelector("[data-ms-btn-copy]");
        this._elements.btnsSocial = this._elements.modal.querySelectorAll("[data-action]");

        this._elements.btnClose.addEventListener("click", () => this.hideModal());

        this._elements.btnCopy.addEventListener("click", () => {
            navigator.clipboard.writeText(this._elements.shortUrl.textContent).then(r => {
                // Assuming the toast is already initialized
                window.toast.showToast("Copied to clipboard");
            });
        });

        this._elements.btnsSocial.forEach(btn => {
            btn.addEventListener("click", () => {
                switch (btn.getAttribute("data-action")) {
                    case "whatsapp":
                        window.open(`https://api.whatsapp.com/send?text=${this._elements.shortUrl.textContent}`);
                        break;
                    case "twitter":
                        window.open(`https://twitter.com/intent/tweet?text=${this._elements.shortUrl.textContent}`);
                        break;
                    case "email":
                        window.open(`mailto:?subject=Shorten URL&body=${this._elements.shortUrl.textContent}`);
                        break;
                }
            });
        });

    }

    showModal(url) {
        this._elements.shortUrl.textContent = url;
        super.show();
    }
    hideModal() {
        super.hide();
    }
}

// Required because of the webpack, it strips off the unused classes in the build
window.__share_modal_instance__ ||= null;
export default ShareModal;