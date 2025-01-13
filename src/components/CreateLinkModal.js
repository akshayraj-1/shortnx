class CreateLinkModal {
    #backdrop;
    #modal;

    constructor() {
        this.#backdrop = document.createElement("div");
        this.#backdrop.className = `modal-backdrop hidden`;
        this.#modal = document.createElement("div");
        this.#modal.className = `flex flex-col w-full max-w-[400px] p-6 md:p-8 bg-colorSurface rounded-xl`;
        this.#modal.innerHTML = `
            <div class="flex items-center justify-between">
                <h3 class="text-lg sm:text-xl font-semibold">Create a link</h3>
            </div>
            `;
        document.body.prepend(this.#backdrop);
        document.body.prepend(this.#modal);
    }

    show() {
        this.#backdrop.classList.remove("hidden");
        this.#backdrop.classList.add("animate-fade-in", "flex", "justify-center", "items-center");
        this.#modal.classList.remove("hidden");
        this.#modal.classList.add("animate-fade-in", "flex", "justify-center", "items-center");
        document.body.style.overflow = "hidden";
    }

}