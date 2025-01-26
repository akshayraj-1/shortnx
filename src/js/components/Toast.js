/**
 * @description
 * This class is used to display toast messages
 *
 */

// This could have been done with functions,
// but using a class makes the code more organized and easier to manage.

class Toast {
    #elements;
    #queue = [];
    #styles = {
        container: {
            default: ["hidden", "fixed", "z-[51]", "bottom-5", "md:bottom-9", "left-0", "right-0", "w-full", "px-6", "select-none"],
            show: ["animate-slide-in-up"],
            hide: ["animate-slide-out-down", "hidden"]
        },
        toast: {
            default: ["relative", "mx-auto", "w-full", "md:w-fit", "max-w-sm", "px-4", "md:px-6", "py-3", "sm:py-2.5", "text-[0.9rem]", "text-white", "bg-black", "rounded-md", "shadow-card"],
        }
    };
    types = {
        info: "toast-info",
        success: "toast-success",
        warning: "toast-warning",
        error: "toast-error"
    };

    constructor() {
        this.#elements = {};
        this.#elements.container = document.createElement("div");
        this.#elements.toast = document.createElement("div");

        this.#elements.container.className = this.#styles.container.default.join(" ");
        this.#elements.toast.className = this.#styles.toast.default.join(" ");

        this.#elements.container.appendChild(this.#elements.toast);
        document.body.prepend(this.#elements.container);
    }

    showToast(message, type = this.types.info) {
        if (this.#queue.length > 0 && this.#queue[this.#queue.length - 1].message === message) return;
        this.#queue.push({ message, type });
        if (this.#queue.length === 1) this.#processQueue();
    }

    #processQueue() {
        if (!this.#queue.length) return;
        this.#elements.toast.innerHTML = this.#queue[0].message;
        this.#elements.toast.classList.add(this.#queue[0].type);
        this.#elements.container.classList.remove(...this.#styles.container.hide);
        this.#elements.container.classList.add(...this.#styles.container.show);
        setTimeout(async () => {
            this.#elements.container.classList.add("animate-slide-out-down");
            await new Promise(resolve => setTimeout(() => {
                this.#elements.container.classList.add("hidden");
                this.#elements.toast.classList.remove(this.#queue[0].type);
                this.#queue.shift();
                resolve();
            }, 200));
            this.#processQueue();
        }, 2500);
    }
}

// Required because of the webpack, it strips off the unused classes in the build
// Could have used modular imports/exports but since I am using script tag to load the files, this is the best option
window.toast = new Toast();