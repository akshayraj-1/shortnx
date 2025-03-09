import EventBus from "../../helpers/EventBus";
import LinkCard from "../../components/LinkCard";
import LinkModal from "../../components/LinkModal";
import Toast from "../../components/Toast";
import { switchVisibilities, positionDropdown } from "../../helpers/ui-helpers";

const eventbus = EventBus.getInstance();
const btnCreateLink = document.getElementById("btn-create-link");
const linksContainer = document.getElementById("view-links");

let fetchedUrls = [];
let currentPageUrls = [];
let currentPage = 1;
const limit = 15;

// Eventbus Listeners
eventbus.on("link_created", (linkData) => {
    prependNewLink(linkData);
    window.navigator.clipboard.writeText(linkData.shortenUrl).then(() => {
        LinkModal.getInstance().hideModal();
        Toast.getInstance().showToast("Copied to clipboard");
    });
});

// UI Event Listeners
btnCreateLink.addEventListener("click", () => {
    LinkModal.getInstance().showModal("create", eventbus, "link_created");
});

// Load Links with Pagination
async function loadLinks(page) {
    try {
        const response = await fetch(`/url/get-user-urls?page=${page}&limit=${limit}`);
        const parsedResponse = await response.json();

        if (parsedResponse.success) {
            const urls = parsedResponse.data.urls || [];
            if (urls.length > 0) {
                currentPageUrls = urls;
                fetchedUrls.push(...urls);
                appendLinks(urls);
                currentPage++;
                switchVisibilities(["#view-links"], ["#view-links-loading", "#view-no-links"]);
            }
        }

        return parsedResponse.success && parsedResponse.data.urls.length > 0;

    } catch (error) {
        console.error("Failed to load links:", error);
    }

    return false;
}

// Prepend New Link at the Top (Without Full Re-render)
function prependNewLink(linkData) {
    currentPageUrls.unshift(linkData);
    fetchedUrls.unshift(linkData);
    if (currentPageUrls.length > limit) {
        currentPageUrls.pop();
        linksContainer.lastChild.remove();
    }
    const newItem = LinkCard.newInstance().render(linkData);
    linksContainer.prepend(newItem);

    // If there were no links before
    if (currentPageUrls.length === 1) {
        switchVisibilities(["#view-links"], ["#view-no-links", "#view-links-loading"]);
    }
}

// Append Only New Links (No Full Re-render)
function appendLinks(urls) {
    const fragment = document.createDocumentFragment();
    urls.forEach(url => fragment.appendChild(LinkCard.newInstance().render(url)));
    linksContainer.appendChild(fragment);
}


(function () {

    // Add Event Listener (Event Delegation)
    linksContainer.addEventListener("click", function (event) {
        const target = event.target;
    });

    // Initial Load
    loadLinks(currentPage).then(success => {
        if (!success) {
            switchVisibilities(["#view-no-links"], ["#view-links", "#view-links-loading"]);
        }
    });
})();




