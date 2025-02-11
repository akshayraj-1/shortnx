/**
 * @description
 * This class is used to display toast messages
 *
 */

// This could have been done with factory functions,
// but using a class makes the code more organized and easier to manage,
// also for the UI components class approach is more recommended

class Toast {
    _elements;
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

    constructor() {

        // Singleton
        if (window.__toast_instance__) return window.__toast_instance__;

        this._elements = {};
        this._elements.container = document.createElement("div");
        this._elements.toast = document.createElement("div");

        this._elements.container.className = this.#styles.container.default.join(" ");
        this._elements.toast.className = this.#styles.toast.default.join(" ");

        this._elements.container.appendChild(this._elements.toast);
        document.body.prepend(this._elements.container);

        // Storing the instance because the webpack encloses the classes into a separate closure function,
        // so inorder to maintain the same instance, I am using window object
        window.__toast_instance__ = this;
    }

    static getInstance() {
        return window.__toast_instance__ || new Toast();
    }

    showToast(message) {
        if (this.#queue.length > 0 && this.#queue[this.#queue.length - 1] === message) return;
        this.#queue.push(message);
        if (this.#queue.length === 1) this.#processQueue();
    }

    #processQueue() {
        if (!this.#queue.length) return;
        this._elements.toast.innerHTML = this.#queue[0];
        this._elements.container.classList.remove(...this.#styles.container.hide);
        this._elements.container.classList.add(...this.#styles.container.show);
        setTimeout(async () => {
            this._elements.container.classList.add("animate-slide-out-down");
            await new Promise(resolve => setTimeout(() => {
                this._elements.container.classList.add("hidden");
                this.#queue.shift();
                resolve();
            }, 200));
            this.#processQueue();
        }, 2500);
    }
}

// Required because of the webpack, it strips off the unused classes in the build
window.__toast_instance__ ||= null;
export default Toast;