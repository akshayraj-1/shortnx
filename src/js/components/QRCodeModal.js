import ModalWrapper from "./ModalWrapper";


class QRCodeModal extends ModalWrapper {

    constructor() {

        if (window.__qrcode_modal_instance) return window.__qrcode_modal_instance;

        super(document.createElement("div"));



        window.__qrcode_modal_instance = this;
    }


}


window.__qrcode_modal_instance ||= null;

export default QRCodeModal;