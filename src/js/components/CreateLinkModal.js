import ModalWrapper from "./ModalWrapper";

class CreateLinkModal extends ModalWrapper {
    #createMode = true;
    #elements;
    #styles = {
        modal: {
            default: ["flex-1", "w-full", "max-w-3xl", "py-9", "bg-colorSurface", "rounded-xl"],
        }
    };

    constructor() {
        const modal = document.createElement("div");
        super(modal);
        this.#elements = { modal };
        this.#elements.modal.className = this.#styles.modal.default.join(" ");
        this.#elements.modal.innerHTML = `
              <div class="flex flex-col px-6 sm:px-8 md:px-10 size-full">
                    <div class="flex justify-between items-center w-full">
                        <h3 class="text-lg sm:text-xl font-semibold">
                            <img class="inline-block me-1.5 size-6 object-contain"
                                 src="/images/ic_link.png"
                                 alt="icon"/>
                            Create link
                        </h3>
                        <button data-ml-btn-close class="icon-close-md text-[1.2rem] text-textPrimary"></button>
                    </div>
                    <div class="h-full flex flex-wrap gap-5 mt-10 overflow-y-auto overflow-x-hidden no-scrollbar" style="max-height: calc(100vh - 200px);">
                        <div class="flex-1 flex flex-col gap-4 min-w-3xs">
                            <div class="flex flex-col gap-1.5">
                                <label for="input-target-link" class="text-sm text-textSecondary font-medium">Target link</label>
                                <input data-ml-input-target-link
                                       class="input-default text-[0.9rem]"
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
                                <div class="p-0.5 mx-auto border w-full bg-white border-colorBorder rounded-lg overflow-hidden">
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
                     <button data-ml-btn-submit disabled class="relative flex justify-center items-center gap-2 text-[0.9rem] text-white text-center mt-8 px-6 py-2.5 w-full bg-colorPrimary rounded-lg 
                     cursor-pointer select-none transition-shadow hover:shadow-lg hover:shadow-colorAccent/25 disabled:bg-colorPrimaryDark disabled:pointer-events-none disabled:hover:shadow-none">
                            Create Link
                     </button>            
               </div>
            `;
        this.#init();
    }

    #init() {
        this.#elements.btnClose = this.#elements.modal.querySelector("[data-ml-btn-close]");
        this.#elements.btnGenerateRandomId = this.#elements.modal.querySelector("[data-ml-btn-generate]");
        this.#elements.inputTargetLink = this.#elements.modal.querySelector("[data-ml-input-target-link]");
        this.#elements.inputShortLink = this.#elements.modal.querySelector("[data-ml-input-short-link]");
        this.#elements.inputTitle = this.#elements.modal.querySelector("[data-ml-input-link-title]");
        this.#elements.inputComments = this.#elements.modal.querySelector("[data-ml-input-comments]");
        this.#elements.btnDownload = this.#elements.modal.querySelector("[data-ml-btn-download]");
        this.#elements.btnSubmit = this.#elements.modal.querySelector("[data-ml-btn-submit]");
        this.#elements.qrcode = this.#elements.modal.querySelector("#qr1");
        this.#elements.colors = this.#elements.modal.querySelectorAll('input[name="foreground"]');
        this.#elements.qrlogo = this.#elements.modal.querySelector(`svg[slot="icon"] rect`);


        this.#elements.btnClose.addEventListener("click", () => this.hideModal());

        this.#elements.qrcode.addEventListener("codeRendered", () => this.#elements.qrcode.animateQRCode("MaterializeIn"));
        this.#elements.colors.forEach(color => {
            color.addEventListener("change", () => {
                this.#elements.qrcode.setAttribute('module-color', `${color.value}`);
                this.#elements.qrcode.setAttribute('position-ring-color', `${color.value}`);
                this.#elements.qrcode.setAttribute('position-center-color', `${color.value}`);
                this.#elements.qrlogo.setAttribute('fill', `${color.value}`);
            });
        });
        this.#elements.btnGenerateRandomId.addEventListener("click", () => {
            this.#elements.inputShortLink.value = Math.random().toString(36).substring(7);
            this.#elements.qrcode.contents = `https://shortnx.in/${this.#elements.inputShortLink.value}`;
            this.#elements.qrcode.animateQRCode('MaterializeIn');
        });

        this.#elements.btnDownload.addEventListener("click", () => {
            // Change btn state to loading
            let prevText = this.#elements.btnDownload.innerHTML;
            this.#elements.btnDownload.textContent = "Saving...";
            this.#elements.btnDownload.disabled = true;
            // Generate QR Code
            html2canvas(this.#elements.qrcode.parentNode, {
                scale: 4,
                backgroundColor: null,
                logging: false,
            }).then(canvas => {
                const link = document.createElement("a");
                link.download = `shortnx-${this.#elements.inputShortLink.value}.png`;
                link.href = canvas.toDataURL("image/png");
                link.click();
                // Reset btn state
                this.#elements.btnDownload.innerHTML = prevText;
                this.#elements.btnDownload.disabled = false;
            });
        })

        this.#elements.inputTitle.addEventListener("input", () => {
            if (this.#elements.inputTitle.value.length > 20) {
                this.#elements.inputTitle.value = this.#elements.inputTitle.value.substring(0, 20);
            }
        });

        this.#elements.inputComments.addEventListener("input", () => {
            if (this.#elements.inputComments.value.length > 100) {
                this.#elements.inputComments.value = this.#elements.inputComments.value.substring(0, 100);
            }
        });

        this.#elements.inputTargetLink.addEventListener("input", (e) => {
            this.#elements.btnSubmit.disabled = e.target.value.length === 0;
        });

        let debounce = null;
        this.#elements.inputShortLink.addEventListener("input", (e) => {
            if (debounce) clearTimeout(debounce);
            if (e.target.value.length > 12) {
                e.target.value = e.target.value.substring(0, 12);
            }
            debounce = setTimeout(() => {
                this.#elements.qrcode.contents = `https://shortnx.in/${e.target.value}`;
                this.#elements.qrcode.animateQRCode('MaterializeIn');
            }, 500);
        });

        this.#elements.btnSubmit.addEventListener("click", () => {
            if (this.#createMode) this.#createNewLink();
        })

    }

    // TODO: Implement the modes:
    //  1. Create
    //  2. Edit
    _toggleMode(mode, data) {
        this._toggleBtnState(this.#elements.btnSubmit, true);
        this.#createMode = mode || false;
        if (this.#createMode) {
            this.#elements.inputTitle.value = "";
            this.#elements.inputComments.value = "";
            this.#elements.inputTargetLink.value = "";
            this.#elements.inputShortLink.readOnly = false;
            this.#elements.btnGenerateRandomId.click();
        } else {
            this.#elements.inputTitle.value = data.title;
            this.#elements.inputShortLink.readOnly = true;
            this.#elements.inputShortLink.value = data.shortenUrl;

        }
    }

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


    async #createNewLink() {
        if (!this.#createMode) return;
        try {
            this._toggleBtnState(this.#elements.btnSubmit, false, true);
            const payload = JSON.stringify({
                title: this.#elements.inputTitle.value,
                targetUrl: this.#elements.inputTargetLink.value,
                shortUrlId: this.#elements.inputShortLink.value,
                comments: this.#elements.inputComments.value
            });
            const response = await fetch("/url/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: payload
            });

            const data = await response.json();
            if (response.ok) {
                window.alert(JSON.stringify(data));
                window.open(data.shortenUrl);
                // TODO: Show success modal
            } else {
                window.toast.showToast(data.message, "error");
            }

        } catch (error) {
            console.log(error);
        } finally {
            this._toggleBtnState(this.#elements.btnSubmit, true);
        }
    }



    showModal(mode = "create", data = {}) {
        this._toggleMode(mode, data);
        super.show();
    }

    hideModal() {
        super.hide();
    }

}

window.createLinkModal = new CreateLinkModal();