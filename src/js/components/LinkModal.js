import ModalWrapper from "./ModalWrapper";
import InputValidation from "../helpers/InputValidation";
import { toggleButtonLoading } from "../helpers/ui-helpers";
import validator from "../../utils/validator.util";

/**
 * @type {LinkModal}
 * @description  Class to create/edit links
 *
 */
class LinkModal extends ModalWrapper {

    static Modes = {
        CREATE_LINK: 1,
        UPDATE_LINK: 2
    };

    #mode = LinkModal.Modes.CREATE_LINK;
    #styles = {
        modal: {
            default: ["flex-1", "h-full", "sm:max-h-[85vh]", "max-w-3xl", "mt-auto", "sm:my-auto", "py-9", "bg-colorSurface", "rounded-xl"],
        },
        btnSubmit: {
            default: [
                "relative", "flex", "justify-center", "items-center", "gap-2",
                "text-[0.9rem]", "text-white", "text-center", "mt-8", "px-6", "py-2.5",
                "w-full", "bg-colorPrimary", "rounded-lg", "cursor-pointer", "select-none", "transition-shadow",
                "hover:shadow-lg", "hover:shadow-colorAccent/25",
            ]
        }
    };

    constructor() {

        // Singleton
        if (window.__link_modal) return window.__link_modal;

        // Continue Setup
        super(document.createElement("div"));
        this._elements.modal.className = this.#styles.modal.default.join(" ");
        this._elements.modal.innerHTML = `
              <div class="flex flex-col px-6 sm:px-8 md:px-10 size-full">
                    <div class="flex justify-between items-center w-full">
                        <h3 class="text-lg sm:text-xl font-semibold">
                            <img data-ml-favicon onload="this.style.opacity=1" class="inline-block me-1.5 size-[25px] object-contain rounded-full opacity-0 transition-opacity duration-300"
                                 src="https://cdn.shortnx.in/images/gradients/?q=default"
                                 alt="icon"/>
                            Create link
                        </h3>
                        <button data-ml-btn-close class="icon-close-md text-[1.2rem] text-textPrimary"></button>
                    </div>
                    <div class="h-full flex flex-wrap gap-5 px-1 mt-10 overflow-y-auto overflow-x-hidden no-scrollbar" style="max-height: calc(100vh - 200px)">
                        <div class="flex-1 flex flex-col gap-4 min-w-3xs">
                            <div class="flex flex-col gap-1.5">
                                <label for="input-target-link" class="text-sm text-textSecondary font-medium">Target link</label>
                                <input data-ml-input-target-link
                                       class="input-default text-[0.9rem] whitespace-nowrap"
                                       type="text"
                                />
                            </div>
                            <div class="flex flex-col gap-1.5">
                                <label for="input-short-link" class="flex justify-between items-center text-sm text-textSecondary font-medium">
                                    Short link <button data-ml-btn-generate 
                                    class="icon-shuffle inline-block text-base hover:text-textPrimary" 
                                    title="Generate random short link"></button>
                                </label>
                                <div class="flex items-center rounded-lg border border-slate-300 focus-within:ring-1 focus-within:ring-slate-300">
                                    <span class="text-sm font-medium border-r border-slate-300 px-3 select-none">shortnx.in</span>
                                    <input data-ml-input-short-link
                                           class="flex-1 input-default text-[0.9rem] border-none focus:ring-0"
                                           type="text"
                                    />
                                </div>
                            </div>
                            <div class="flex flex-col gap-1.5">
                                <label for="input-link-title" class="text-sm text-textSecondary font-medium">Title</label>
                                <input data-ml-input-link-title
                                       class="input-default text-[0.9rem]"
                                       type="text"
                                />
                            </div>
                            <div class="flex flex-col gap-1.5">
                                <label for="input-comments" class="text-sm text-textSecondary font-medium">Comments</label>
                                <textarea data-ml-input-comments
                                       class="input-default text-[0.9rem] resize-none"
                                       rows="3"></textarea>
                            </div> 
                        </div>
                        <div class="flex flex-col gap-5 w-full sm:w-auto">
                            <div class="flex flex-col gap-1.5">
                                <span class="text-sm text-textSecondary font-medium">QR Code</span>
                                <div class="p-0.5 mx-auto border w-fit bg-white border-slate-300 rounded-lg overflow-hidden">
                                    <qr-code
                                          id="qr1"
                                          contents="https://shortnx.in/"
                                          module-color="#1e293b"
                                          position-ring-color="#1e293b"
                                          position-center-color="#1e293b"
                                          mask-x-to-y-ratio="1"
                                          style="
                                            width: 180px;
                                            height: 180px;
                                            margin: auto;
                                            user-select: none;
                                            background-color: #fff;
                                          "
                                    >
                                         <svg slot="icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                                <rect width="32" height="32" rx="16" fill="currentColor"/>
                                                <path d="M15.0767 24.4299C11.9568 24.1872 9.45496 22.7111 9.04392 20.8706C8.95892 20.49 9.00309 19.7337 9.12656 19.4557C9.28284 19.1039 9.47506 18.8978 9.79288 18.7413C10.3523 18.4658 11.0858 18.4552 11.6317 18.7149C12.1414 18.9572 12.5162 19.3856 13.1266 20.4235C13.8131 21.5906 14.2554 22.1376 14.7582 22.4408C15.6133 22.9566 16.8201 22.9285 17.4467 22.3782C18.0644 21.8356 18.0093 20.5378 17.3376 19.8088C16.8357 19.2642 16.2356 18.9652 14.3945 18.3424C12.8047 17.8048 12.4877 17.6818 11.8492 17.3551C10.3362 16.5811 9.5208 15.4943 9.27185 13.9199C9.19332 13.4234 9.21266 12.4764 9.31092 12.007C9.66329 10.3234 10.8922 9.03638 12.7336 8.42255C14.424 7.85905 16.5077 7.85925 18.3422 8.42255C20.6201 9.12265 22.1024 10.5735 22.1061 12.1063C22.108 12.8945 21.7656 13.5122 21.1775 13.7815C20.6301 14.0322 19.7671 14.0293 19.2116 13.7748C18.5478 13.4708 18.214 13.0667 17.5631 11.7795C16.9997 10.6653 16.8248 10.3843 16.5074 10.0841C16.1299 9.72689 15.9264 9.65204 15.3261 9.64959C14.8699 9.6477 14.8029 9.65868 14.5438 9.77822C14.2164 9.92923 13.9374 10.2075 13.7982 10.5218C13.6678 10.8165 13.633 11.6116 13.732 12.0338C13.9567 12.9912 14.6407 13.7024 15.8477 14.2333C16.0847 14.3376 16.799 14.6014 17.4351 14.8196C19.3595 15.4797 19.9948 15.7674 20.6975 16.2971C21.7468 17.0881 22.2523 18.1937 22.2496 19.6918C22.2484 20.3158 22.1799 20.7249 21.9933 21.2221C21.3371 22.9707 19.4336 24.1522 16.852 24.4135C16.4133 24.4579 15.5438 24.4656 15.0767 24.4293V24.4299Z" fill="white"/>
                                         </svg>
                                    </qr-code>
                                </div>
                                <button data-ml-btn-download class="text-xs mt-2 px-3 py-2 w-full border border-slate-300 hover:border-slate-400 rounded-lg"><i class="icon-download text-[0.8rem] me-1"></i>Save</button>
                                <div class="flex items-center sm:justify-center flex-wrap gap-x-3 gap-y-2.5 mt-3 px-1 w-full sm:max-w-[180px]">
                                    <label>
                                      <input type="radio" name="foreground" value="#1e293b" checked class="hidden peer">
                                      <span class="w-6 h-6 rounded-full bg-slate-800 block peer-checked:ring-4 peer-checked:ring-slate-300 cursor-pointer"></span>
                                    </label>
                                    <label>
                                      <input type="radio" name="foreground" value="#64748b" class="hidden peer">
                                      <span class="w-6 h-6 rounded-full bg-slate-500 block peer-checked:ring-4 peer-checked:ring-slate-300 cursor-pointer"></span>
                                    </label>
                                    <label>
                                      <input type="radio" name="foreground" value="#38bdf8" class="hidden peer">
                                      <span class="w-6 h-6 rounded-full bg-sky-400 block peer-checked:ring-4 peer-checked:ring-sky-200 cursor-pointer"></span>
                                    </label>
                                    <label>
                                      <input type="radio" name="foreground" value="#4ade80" class="hidden peer">
                                      <span class="w-6 h-6 rounded-full bg-green-400 block peer-checked:ring-4 peer-checked:ring-green-200 cursor-pointer"></span>
                                    </label>
                                    <label>
                                      <input type="radio" name="foreground" value="#60a5fa" class="hidden peer">
                                      <span class="w-6 h-6 rounded-full bg-blue-400 block peer-checked:ring-4 peer-checked:ring-blue-200 cursor-pointer"></span>
                                    </label>
                                    <label>
                                      <input type="radio" name="foreground" value="#f87171" class="hidden peer">
                                      <span class="w-6 h-6 rounded-full bg-red-400 block peer-checked:ring-4 peer-checked:ring-red-200 cursor-pointer"></span>
                                    </label>
                                    <label>
                                      <input type="radio" name="foreground" value="#c084fc" class="hidden peer">
                                      <span class="w-6 h-6 rounded-full bg-purple-400 block peer-checked:ring-4 peer-checked:ring-purple-200 cursor-pointer"></span>
                                    </label>
                                    <label>
                                      <input type="radio" name="foreground" value="#fdba74" class="hidden peer">
                                      <span class="w-6 h-6 rounded-full bg-orange-300 block peer-checked:ring-4 peer-checked:ring-orange-200 cursor-pointer"></span>
                                    </label>
                                    <label>
                                      <input type="radio" name="foreground" value="#f472b6" class="hidden peer">
                                      <span class="w-6 h-6 rounded-full bg-pink-400 block peer-checked:ring-4 peer-checked:ring-pink-300 cursor-pointer"></span>
                                    </label>
                                    <label>
                                      <input type="radio" name="foreground" value="#2dd4bf" class="hidden peer">
                                      <span class="w-6 h-6 rounded-full bg-teal-400 block peer-checked:ring-4 peer-checked:ring-teal-300 cursor-pointer"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                     <button data-ml-btn-submit class="${this.#styles.btnSubmit.default.join(" ")}">
                            Create Link
                     </button>            
               </div>
            `;
        this.#init();

        window.__link_modal = this;
    }

    static getInstance() {
        return window.__link_modal || new LinkModal();
    }

    #init() {
        this._elements.favicon = this._elements.modal.querySelector("[data-ml-favicon]");
        this._elements.btnClose = this._elements.modal.querySelector("[data-ml-btn-close]");
        this._elements.btnGenerateRandomId = this._elements.modal.querySelector("[data-ml-btn-generate]");
        this._elements.inputTargetLink = this._elements.modal.querySelector("[data-ml-input-target-link]");
        this._elements.inputShortLink = this._elements.modal.querySelector("[data-ml-input-short-link]");
        this._elements.inputTitle = this._elements.modal.querySelector("[data-ml-input-link-title]");
        this._elements.inputComments = this._elements.modal.querySelector("[data-ml-input-comments]");
        this._elements.btnDownload = this._elements.modal.querySelector("[data-ml-btn-download]");
        this._elements.btnSubmit = this._elements.modal.querySelector("[data-ml-btn-submit]");
        this._elements.qrcode = this._elements.modal.querySelector("#qr1");
        this._elements.colors = this._elements.modal.querySelectorAll('input[name="foreground"]');
        this._elements.qrlogo = this._elements.modal.querySelector(`svg[slot="icon"] rect`);


        let debounce = null;
        const updateShortLink = (shortUrlId, color) => {
            if (color) {
                this._elements.qrcode.setAttribute('module-color', `${color}`);
                this._elements.qrcode.setAttribute('position-ring-color', `${color}`);
                this._elements.qrcode.setAttribute('position-center-color', `${color}`);
                this._elements.qrlogo.setAttribute('fill', `${color}`);
            }
            if (shortUrlId) {
                if (shortUrlId === this._elements.inputShortLink.value) {
                    if (debounce) clearTimeout(debounce);
                    debounce = setTimeout(() => {
                        if (shortUrlId.length > 5 && shortUrlId.length < 13) {
                            InputValidation.toggleErrorState(this._elements.inputShortLink.parentNode);
                            this._elements.qrcode.contents = `https://shortnx.in/${shortUrlId}`;
                            this._elements.qrcode.animateQRCode('MaterializeIn');
                        } else {
                            InputValidation.toggleErrorState(this._elements.inputShortLink.parentNode, "Length should be between 6-12");
                        }
                    }, 500);
                } else {
                    this._elements.inputShortLink.value = shortUrlId;
                    InputValidation.toggleErrorState(this._elements.inputShortLink.parentNode);
                    this._elements.qrcode.contents = `https://shortnx.in/${shortUrlId}`;
                    this._elements.qrcode.animateQRCode('MaterializeIn');
                }
            }
        }

        // Close Modal
        this._elements.btnClose.addEventListener("click", () => this.hideModal());

        // QR Code Generation
        this._elements.qrcode.addEventListener("codeRendered", () => this._elements.qrcode.animateQRCode("MaterializeIn"));
        this._elements.colors.forEach(color => color.addEventListener("change", () => updateShortLink(null, color.value)));
        this._elements.btnGenerateRandomId.addEventListener("click", () => updateShortLink(Math.random().toString(36).substring(7)));

        // QR Code Download
        this._elements.btnDownload.addEventListener("click", () => {
            // Change btn state to loading
            let prevText = this._elements.btnDownload.innerHTML;
            this._elements.btnDownload.innerText = "Saving...";
            this._elements.btnDownload.disabled = true;
            // Generate QR Code
            html2canvas(this._elements.qrcode.parentNode, {
                scale: 4,
                backgroundColor: null,
                logging: false,
            }).then(canvas => {
                const link = document.createElement("a");
                link.download = `shortnx-${this._elements.inputShortLink.value}.png`;
                link.href = canvas.toDataURL("image/png");
                link.click();
                // Reset btn state
                this._elements.btnDownload.innerHTML = prevText;
                this._elements.btnDownload.disabled = false;
            });
        });

        let lastOrigin = null;
        Array.from([
            this._elements.inputTargetLink,
            this._elements.inputShortLink,
            this._elements.inputTitle,
            this._elements.inputComments
        ]).forEach(input => {
            input.addEventListener("input", (e) => {
                if (input === this._elements.inputShortLink) {
                    updateShortLink(input.value);
                } else if (input.value.length > 0) {
                    if (input === this._elements.inputTargetLink && validator.isURL(input.value)) {
                        const origin = new URL(input.value);
                        if (origin !== lastOrigin) {
                            lastOrigin = origin;
                            this._elements.favicon.style.opacity = 0;
                            this._elements.favicon.src = this._getFavIcon(origin);
                        }
                    }
                    InputValidation.toggleErrorState(input);
                }
            });
        });

        this._elements.btnSubmit.addEventListener("click", () => {
            if (this.#mode === LinkModal.Modes.CREATE_LINK) this.#createLink();
            else if (this.#mode === LinkModal.Modes.UPDATE_LINK) this.#updateLink();
        });

    }

    _toggleMode(mode, data) {
        toggleButtonLoading(this._elements.btnSubmit, false);
        this.#mode = mode;
        this._elements.favicon.src = this._getFavIcon(data?.originalUrl);
        this._elements.inputTitle.value = data?.title || "";
        this._elements.inputTargetLink.value = data?.originalUrl || "";
        this._elements.inputShortLink.readOnly = !!data?.shortUrlId;
        this._elements.inputComments.value = data?.comments || "";
        if (this.#mode === LinkModal.Modes.CREATE_LINK) {
            this._elements.btnSubmit.innerText = "Create Link";
            this._elements.btnGenerateRandomId.style.display = "block";
            this._elements.btnGenerateRandomId.click();
        } else {
            this._elements.btnSubmit.innerText = "Update Link";
            this._elements.inputShortLink.value = data?.shortUrlId;
            this._elements.btnGenerateRandomId.style.display = "none";
        }
    }

    _getFavIcon(url) {
        return `https://cdn.shortnx.in/images/icons/?url=${url}`
    }


    async #createLink() {
        // Validate Inputs
        const inputTargetLink = this._elements.inputTargetLink;
        const inputShortLink = this._elements.inputShortLink;
        const inputTitle = this._elements.inputTitle;
        const inputComments = this._elements.inputComments;

        if (!InputValidation.validateURL(inputTargetLink) ||
            !InputValidation.validateInput(inputShortLink.parentNode, /^[a-zA-Z0-9]{6,12}$/, { error: "Should be between 6-12" }) ||
            !InputValidation.validateInput(inputTitle, /^[a-zA-Z0-9 -]{0,50}$/, { error: "Should be less than 50" }) ||
            !InputValidation.validateInput(inputComments, /^[a-zA-Z0-9 ]{0,100}$/,{ error: "Should be less than 100" })
        ) return;

        try {
            toggleButtonLoading(this._elements.btnSubmit, true);
            const payload = JSON.stringify({
                title: this._elements.inputTitle.value,
                targetUrl: this._elements.inputTargetLink.value,
                shortUrlId: this._elements.inputShortLink.value,
                comments: this._elements.inputComments.value
            });
            const response = await fetch("/url/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: payload
            });

            const parsedResponse = await response.json();
            if (response.ok && parsedResponse.success) {
                // No hiding the modal it's up to the caller
                this._eventbus.emit(this._eventname, parsedResponse.data);
            } else {
                // Parse the error
                const error = parsedResponse.error || {};
                if (error.name === "ALREADY_EXISTS" || error.message?.includes("already exists")) {
                    InputValidation.toggleErrorState(this._elements.inputShortLink.parentNode, "Short link already exists");
                } else if (/(invalid target url)/i.test(error.message)) {
                    InputValidation.toggleErrorState(this._elements.inputTargetLink, "Please enter a valid url");
                } else {
                    window.toast.showToast(error.message);
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            toggleButtonLoading(this._elements.btnSubmit, false);
        }
    }

    async #updateLink() {
        // TODO: Implement Update Link method
    }

    showModal(mode = LinkModal.Modes.CREATE_LINK, eventbus, eventname, data) {
        this._toggleMode(mode, data);
        this._eventbus = eventbus;
        this._eventname = eventname;
        super.show();
    }

    showCreateModal(eventbus, eventname) {
        if (eventbus && eventname) this.showModal(LinkModal.Modes.CREATE_LINK, eventbus, eventname);
    }

    showUpdateModal(eventbus, eventname, data) {
        if (eventbus && eventname) this.showModal(LinkModal.Modes.UPDATE_LINK, eventbus, eventname, data);
    }

    hideModal() {
        super.hide();
    }

}

// Required because of the webpack, it strips off the unused classes in the build
window.__link_modal ||= null;
export default LinkModal;