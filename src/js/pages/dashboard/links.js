import CreateLinkModal from "../../components/CreateLinkModal";

window.createLinkModal = new CreateLinkModal();
const btnCreateLink = document.getElementById("btn-create-link");
const btnSortLinks = document.getElementById("btn-sort-links");

btnCreateLink.addEventListener("click", () => showCreateLinkModal());


function showCreateLinkModal() {
    createLinkModal.showModal();
}