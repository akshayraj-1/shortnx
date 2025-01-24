class CreateLinkModal {
    #backdrop;
    #modal;
    #styles = {
        backdrop: {
            default: ["modal-backdrop", "hidden", "py-10", "sm:px-6"],
            show: ["animate-fade-in", "flex", "justify-center", "items-center", "outline-none"],
            hide: ["animate-fade-out", "hidden"],
        },
        modal: {
            default: ["flex-1", "w-full", "max-w-4xl", "py-9", "bg-colorSurface", "rounded-xl"],
            show: ["animate-pop-up"],
            hide: ["animate-pop-down"]
        }
    }

    constructor() {
        this.#backdrop = document.createElement("div");
        this.#backdrop.className = this.#styles.backdrop.default.join(" ");
        this.#modal = document.createElement("div");
        this.#modal.className = this.#styles.modal.default.join(" ");
        this.#modal.innerHTML = `
              <div class="flex flex-col px-6 sm:px-8 md:px-10 size-full">
                    <div class="flex justify-between items-center w-full">
                        <h3 class="text-lg sm:text-xl font-semibold">
                            <img class="inline-block text-[15px] p-1 me-1.5 size-7 bg-gray-100 rounded-full"
                                 src="https://cdn.shortnx.in/images/site-alt.svg"
                                 alt="icon"/>
                            Create link
                        </h3>
                        <button id="modal-link-btn-close" class="icon-close-md text-[1.2rem] text-textPrimary"></button>
                    </div>
                    <div class="h-full flex flex-wrap gap-5 mt-10 overflow-y-auto overflow-x-hidden no-scrollbar" style="max-height: calc(100vh - 200px);">
                        <div class="flex-1 flex flex-col gap-4 min-w-3xs">
                            <div class="flex flex-col gap-1.5">
                                <label for="input-target-link" class="text-sm text-textSecondary font-medium">Target link</label>
                                <input id="input-target-link"
                                       class="input-default text-[0.9rem]"
                                       type="text"
                                />
                            </div>
                            <div class="flex flex-col gap-1.5">
                                <label for="input-short-link" class="flex justify-between items-center text-sm text-textSecondary font-medium">
                                    Short link <button id="btn-generate-random-id" 
                                    class="icon-shuffle inline-block text-base hover:text-textPrimary" 
                                    title="Generate random short link"></button>
                                </label>
                                <div class="flex items-center rounded-lg border border-slate-300 focus-within:ring-1 focus-within:ring-slate-300">
                                    <span class="text-sm font-medium border-r border-slate-300 px-3 select-none">shortnx.in</span>
                                    <input id="input-short-link"
                                           class="flex-1 input-default text-[0.9rem] border-none focus:ring-0"
                                           type="text"
                                    />
                                </div>
                            </div>
                            <div class="flex flex-col gap-1.5">
                                <label for="input-link-title" class="text-sm text-textSecondary font-medium">Title</label>
                                <input id="input-link-title"
                                       class="input-default text-[0.9rem]"
                                       type="text"
                                />
                            </div>
                            <div class="flex flex-col gap-1.5">
                                <label for="input-comments" class="text-sm text-textSecondary font-medium">Comments</label>
                                <textarea id="input-comments"
                                       class="input-default text-[0.9rem] resize-none"
                                       rows="4"></textarea>
                            </div> 
                        </div>
                        <div class="flex flex-col gap-5 w-full sm:w-auto">
                            <div class="flex flex-col gap-1.5">
                                <span class="text-sm text-textSecondary font-medium">QR Code</span>
                                <div class="p-1 mx-auto border w-full border-colorBorder rounded-lg">
                                    <qr-code
                                          id="qr1"
                                          contents="https://shortnx.in/"
                                          module-color="#1e1e1e"
                                          position-ring-color="#1e1e1e"
                                          position-center-color="#1e1e1e"
                                          mask-x-to-y-ratio="1"
                                          style="
                                            width: 220px;
                                            height: 220px;
                                            user-select: none;
                                            margin: auto;
                                            background-color: #fff;
                                          "
                                    >
                                        <img src="https://cdn.shortnx.in/images/qr_logo.svg" alt="" draggable="false" slot="icon"/>
                                    </qr-code>
                                </div>
                                <div class="flex flex-wrap">
                                    <input class="" type="radio" >
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex justify-between items-center mt-8">
                        <div class="flex justify-center items-center">
                            <button class="">
                                <i></i>
                                Additional options
                            </button>
                        </div>
                        <button class="relative px-6 py-2.5 text-[0.9rem] text-white text-center bg-colorPrimary rounded-lg cursor-pointer transition-shadow hover:shadow-lg hover:shadow-colorAccent/25">
                            Create Link
                        </button>
                        
                    </div>                
                </div>
            `;


        const btnClose = this.#modal.querySelector("#modal-link-btn-close");
        const btnGenerateRandomId = this.#modal.querySelector("#btn-generate-random-id");
        const inputTargetLink = this.#modal.querySelector("#input-target-link");
        const inputShortLink = this.#modal.querySelector("#input-short-link");
        const qrcode = this.#modal.querySelector("#qr1");

        btnClose.addEventListener("click", () => {
            this.hide();
        });

        inputTargetLink.addEventListener("input", (e) => {
            this.#fetchMetaData(e.target.value)
                .then((response) => {
                    const metaData = JSON.parse(response);
                    inputShortLink.value = metaData.url;
                    console.log(metaData);
                })
                .catch((error) => {
                    console.log(error);
                });
        });


        let debounce = null;
        let prev = null;
        inputShortLink.addEventListener("input", (e) => {
            if (prev === e.target.value) return;
            if (debounce) clearTimeout(debounce);
            if (e.target.value.length > 12) {
                e.target.value = e.target.value.substring(0, 12);
            }
            debounce = setTimeout(() => {
                prev = e.target.value;
                qrcode.contents = `https://shortnx.in/${e.target.value}`;
                qrcode.animateQRCode('MaterializeIn');
            }, 500);
        });

        btnGenerateRandomId.addEventListener("click", () => {
            inputShortLink.value = this.#generateRandomId();
        });

        const randomId = this.#generateRandomId();
        qrcode.contents = `https://shortnx.in/${randomId}`;
        inputShortLink.value = randomId;
        this.#backdrop.prepend(this.#modal);
        document.body.prepend(this.#backdrop);

        document.getElementById('qr1').addEventListener('codeRendered', () => {
            document.getElementById('qr1').animateQRCode('MaterializeIn');
        });
    }


    #isLoading = false;
    #fetchMetaData(url) {
        if (this.#isLoading) return;
        this.#isLoading = true;
        return new Promise((resolve, reject) => {
            // TODO: Fetch meta data of the url
            this.#isLoading = false;
        })
    }

    #generateRandomId() {
        return Math.random().toString(36).substring(7);
    }

    show() {
        this.#backdrop.setAttribute("aria-hidden", "false");
        this.#modal.setAttribute("aria-modal", "true");
        this.#modal.setAttribute("role", "dialog");
        this.#modal.setAttribute("tabindex", "0");
        this.#backdrop.classList.remove(...this.#styles.backdrop.hide);
        this.#backdrop.classList.add(...this.#styles.backdrop.show);
        this.#modal.classList.remove(...this.#styles.modal.hide);
        this.#modal.classList.add(...this.#styles.modal.show);
        document.body.style.overflow = "hidden";


    }

    hide() {
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
    }

}