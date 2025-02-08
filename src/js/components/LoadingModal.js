import ModalWrapper from "./ModalWrapper";

/**
 * @type {LoadingModal}
 * @description This class is used to display loading animation over the entire page
 *
 */
class LoadingModal extends ModalWrapper {

    constructor() {

        // Using window object to keep the instance because the webpack encloses the classes into
        // a separate closure function, so inorder to maintain the same instance, we need to use window
        if (typeof window !== "undefined" && window.__loading_modal_instance) return window.__loading_modal_instance;
        super(document.createElement("div"));
        window.__loading_modal_instance = this;

        // Continue Setup
        this._elements.modal.innerHTML = '<div class="loader"></div>';
    }
}

// For Browser (script tag)
if (typeof window !== "undefined" && !window.loadingModal) {
    window.loadingModal = new LoadingModal();
}

// For ES6 modules
export default LoadingModal;