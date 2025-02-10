import EventBus from "../../helpers/EventBus";
import LinkModal from "../../components/LinkModal";


const eventbus = EventBus.getInstance();
const btnCreateLink = document.getElementById("btn-create-link");
const btnSortLinks = document.getElementById("btn-sort-links");

btnCreateLink.addEventListener("click", () => showCreateLinkModal());


eventbus.on("link_created", (data) => {
    window.alert(JSON.stringify(data));
});

function showCreateLinkModal() {
    LinkModal.getInstance().showCreateModal(eventbus,"link_created");
}