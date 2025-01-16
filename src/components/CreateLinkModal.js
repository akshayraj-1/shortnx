const qrScript = document.createElement("script");
// Source: https://qr.bitjson.com/
qrScript.src = "https://unpkg.com/@bitjson/qr-code@1.0.2/dist/qr-code.js";
document.body.appendChild(qrScript);

class CreateLinkModal {
    #backdrop;
    #modal;
    #styles = {
        backdrop: {
            default: ["modal-backdrop", "hidden", "py-10", "px-6"],
            show: ["animate-fade-in", "flex", "justify-center", "items-center", "outline-none"],
            hide: ["animate-fade-out", "hidden"],
        },
        modal: {
            default: ["w-full", "max-w-xl", "py-10", "bg-colorSurface", "rounded-xl"],
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
              <div class="flex flex-col px-8 md:px-10 size-full overflow-y-auto">
                    <div class="flex justify-between items-center w-full">
                        <h3 class="text-lg sm:text-xl font-semibold">
                            <i class="icon-link inline-block text-[15px] p-2.5 me-2 bg-gray-100 rounded-full"></i>
                            Create link
                        </h3>
                        <button id="modal-link-btn-close" class="icon-close-md text-[1.2rem] text-textPrimary"></button>
                    </div>
                    <div class="flex flex-col gap-4 mt-10">
                        <div class="flex flex-col gap-1.5">
                            <label for="input-target-link" class="text-sm text-textSecondary font-medium">Target link</label>
                            <input id="input-target-link"
                                   class="input-default"
                                   type="text"
                            />
                        </div>
                        <div class="flex flex-col gap-1.5">
                            <label for="input-short-link" class="flex justify-between items-center text-sm text-textSecondary font-medium">
                                Short link <button id="btn-generate-random-id" 
                                class="icon-shuffle inline-block text-base hover:text-textPrimary" 
                                title="Generate random short link"></button>
                            </label>
                            <div class="flex items-center w-full rounded-lg border border-slate-300 focus-within:ring-1 focus-within:ring-slate-300">
                                <span class="text-sm font-medium border-r border-slate-300 px-3 select-none">shortnx.in</span>
                                <input id="input-short-link"
                                       class="flex-1 input-default border-none focus:ring-0"
                                       type="text"
                                />
                            </div>
                        </div>
                        <div class="flex flex-col gap-1.5">
                            <label for="input-link-title" class="text-sm text-textSecondary font-medium">Title</label>
                            <input id="input-link-title"
                                   class="input-default"
                                   type="text"
                            />
                        </div>
                        <div class="flex flex-col gap-1.5">
                            <label for="input-link-description" class="text-sm text-textSecondary font-medium">Description</label>
                            <textarea id="input-link-description"
                                      class="input-default resize-none"
                                      rows="3"
                            ></textarea>
                        </div>
                    </div>
                    <button class="relative mt-3 px-4 py-2.5 text-[0.9rem] text-white text-center w-full bg-colorPrimary rounded-lg cursor-pointer transition-shadow hover:shadow-lg hover:shadow-colorAccent/25">Create Link</button>
                
                </div>
            `;


        const btnClose = this.#modal.querySelector("#modal-link-btn-close");
        const btnGenerateRandomId = this.#modal.querySelector("#btn-generate-random-id");
        const inputTargetLink = this.#modal.querySelector("#input-target-link");
        const inputShortLink = this.#modal.querySelector("#input-short-link");

        btnClose.addEventListener("click", () => {
            this.hide();
        });

        inputTargetLink.addEventListener("input", (e) => {
            console.log("Changed");
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

        btnGenerateRandomId.addEventListener("click", () => {
            inputShortLink.value = this.#generateRandomId();
        });

        inputShortLink.value = this.#generateRandomId();
        this.#backdrop.prepend(this.#modal);
        document.body.prepend(this.#backdrop);
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