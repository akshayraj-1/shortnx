class Toast {
    #container;
    #toast;
    #queue = [];
    types = {
        info: "toast-info",
        success: "toast-success",
        warning: "toast-warning",
        error: "toast-error"
    };

    constructor() {
        this.#container = document.createElement("div");
        this.#container.className = "hidden fixed z-[51] bottom-5 md:bottom-9 left-0 right-0 w-full px-6 select-none";
        this.#toast = document.createElement("div");
        this.#toast.className = "relative mx-auto w-full md:w-fit max-w-sm px-4 md:px-6 py-3 sm:py-2.5 text-[0.9rem] text-white bg-black rounded-md shadow-card";
        this.#container.prepend(this.#toast);
        document.body.prepend(this.#container);
    }

    showToast(message, type = this.types.info) {
        if (this.#queue.length > 0 && this.#queue[this.#queue.length - 1].message === message) return;
        this.#queue.push({ message, type });
        if (this.#queue.length === 1) this.#processQueue();
    }

    #processQueue() {
        if (!this.#queue.length) return;
        this.#toast.innerHTML = this.#queue[0].message;
        this.#toast.classList.add(this.#queue[0].type);
        this.#container.classList.remove("animate-slide-out-down");
        this.#container.classList.remove("hidden");
        this.#container.classList.add("animate-slide-in-up");
        setTimeout(async () => {
            this.#container.classList.add("animate-slide-out-down");
            await new Promise(resolve => setTimeout(() => {
                this.#container.classList.add("hidden");
                this.#toast.classList.remove(this.#queue[0].type);
                this.#queue.shift();
                resolve();
            }, 200));
            this.#processQueue();
        }, 2500);
    }
}