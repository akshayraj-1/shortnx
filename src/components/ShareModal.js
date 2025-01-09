class ShareModal {
    #backdrop;
    #container;
    #closeModal;
    #shortUrl;
    #btnCopyUrl;
    #btnWhatsapp;
    #btnTwitter;
    #btnEmail;

    constructor() {
        this.#backdrop = document.createElement("div");
        this.#backdrop.className = "modal-backdrop hidden";
        this.#backdrop.innerHTML = `
            <div id="modal-container" class="flex flex-col w-full max-w-[400px] p-6 md:p-8 bg-colorSurface rounded-xl">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg sm:text-xl font-semibold">Your link is ready! 🎉</h3>
                    <i id="modal-share-btn-close" class="text-[1.5rem] text-textSecondary cursor-pointer icon-close-md"></i>
                </div>
                <div class="flex items-center justify-evenly mt-8 gap-3">
                    <button id="modal-share-btn-whatsapp" class="p-5 rounded-full ring-1 ring-inset ring-slate-300 cursor-pointer size-[4.5rem]" title="Share on WhatsApp">
                        <img src="/images/whatsapp.svg" alt="Share on WhatsApp">
                    </button>
                    <button id="modal-share-btn-twitter" class="p-5 rounded-full ring-1 ring-slate-300 cursor-pointer size-[4.5rem]" title="Share on X">
                        <img src="/images/twitter_alt.svg" alt="Share on Twitter">
                    </button>
                    <button id="modal-share-btn-email" class="p-5 rounded-full ring-1 ring-inset ring-slate-300 cursor-pointer size-[4.5rem]" title="Share via Email">
                        <img src="/images/envelope.svg" alt="Share via Email">
                    </button>
                </div>
                <div class="relative mt-8 mb-4 px-4 py-2.5 font-medium bg-colorSurfaceSecondary rounded-md ring-1 ring-inset ring-slate-300 overflow-hidden">
                    <span id="short-url" class="w-full text-sm sm:text-base text-textPrimary overflow-ellipsis overflow-hidden"></span>
                    <i id="modal-share-btn-copy" class="absolute top-0 right-0 flex items-center justify-center h-full px-3 bg-colorPrimary text-white cursor-pointer icon-copy-alt" title="Copy URL" aria-label="Copy URL"></i>
                </div>
            </div>
        `;
        document.body.prepend(this.#backdrop);
        this.#container = document.getElementById("modal-container");
        this.#closeModal = document.getElementById("modal-share-btn-close");
        this.#shortUrl = document.getElementById("short-url");
        this.#btnCopyUrl = document.getElementById("modal-share-btn-copy");
        this.#btnWhatsapp = document.getElementById("modal-share-btn-whatsapp");
        this.#btnTwitter = document.getElementById("modal-share-btn-twitter");
        this.#btnEmail = document.getElementById("modal-share-btn-email");
        this.#init();
    }
    #init() {
        this.#closeModal.addEventListener("click", () => this.hideModal());
        this.#btnCopyUrl.addEventListener("click", () => {
            navigator.clipboard.writeText(this.#shortUrl.textContent).then(r => {
                toast.showToast("Copied to clipboard", toast.types.success);
            });
        });
        this.#btnWhatsapp.addEventListener("click", () => {
            window.open(`https://api.whatsapp.com/send?text=${this.#shortUrl.textContent}`);
        });
        this.#btnTwitter.addEventListener("click", () => {
            window.open(`https://twitter.com/intent/tweet?text=${this.#shortUrl.textContent}`);
        });
        this.#btnEmail.addEventListener("click", () => {
            window.open(`mailto:?subject=Shorten URL&body=${this.#shortUrl.textContent}`);
        });
    }

    // TODO: Convert the dialog the bottom sheet style for mobile devices
    showModal(url) {
        this.#shortUrl.textContent = url;
        this.#backdrop.classList.remove("animate-fade-out");
        this.#backdrop.classList.remove("hidden");
        this.#backdrop.classList.add("flex", "justify-center", "items-center");
        this.#container.classList.remove("animate-fade-out");
        this.#container.classList.add("animate-fade-in");
        document.body.style.overflow = "hidden";
    }
    hideModal() {
        this.#container.classList.remove("animate-fade-in");
        this.#container.classList.add("animate-fade-out");
        this.#container.classList.add("animate-fade-out");
        setTimeout(() => {
            this.#backdrop.classList.remove("flex", "justify-center", "items-center");
            this.#backdrop.classList.add("hidden");
            document.body.style.overflow = "auto";
        }, 300);
    }
}