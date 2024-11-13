class LoadingModal {
    #backdrop;
    #loader;

    constructor() {
        this.#backdrop = document.createElement("div");
        this.#backdrop.className = "modal-backdrop hidden";
        this.#loader = document.createElement("div");
        this.#loader.className = "loader";
        this.#backdrop.appendChild(this.#loader);
        document.body.prepend(this.#backdrop);
    }
}