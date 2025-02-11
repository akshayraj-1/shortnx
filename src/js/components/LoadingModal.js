import ModalWrapper from "./ModalWrapper";

/**
 * @type {LoadingModal}
 * @description This class is used to display loading animation over the entire page
 *
 */
class LoadingModal extends ModalWrapper {

    constructor() {

        // Singleton
        if (window.__loading_modal_instance__) return window.__loading_modal_instance__;

        // Continue Setup
        super(document.createElement("div"));
        this._elements.modal.innerHTML = '<div class="loader"></div>';

        // Storing the instance because the webpack encloses the classes into a separate closure function,
        // so inorder to maintain the same instance, I am using window object
        window.__loading_modal_instance__ = this;
    }

    static getInstance() {
        return window.__loading_modal_instance__ || new LoadingModal();
    }

}

// Required because of the webpack, it strips off the unused classes in the build
window.__loading_modal_instance__ ||= null;
export default LoadingModal;