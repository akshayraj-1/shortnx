import ModalWrapper from "./ModalWrapper";


class QRCodeModal extends ModalWrapper {

    constructor() {

        if (window.__qrcode_modal_instance__) return window.__qrcode_modal_instance__;

        super(document.createElement("div"));

        window.__qrcode_modal_instance__ = this;
    }

}


window.__qrcode_modal_instance__ ||= null;

export default QRCodeModal;