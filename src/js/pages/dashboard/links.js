import EventBus from "../../helpers/EventBus";
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
    LinkModal.getInstance().showCreateModal(eventbus, "link_created");
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
    const newItem = createLinkItem(linkData);
    linksContainer.prepend(newItem);

    // If there were no links before
    if (currentPageUrls.length === 1) {
        switchVisibilities(["#view-links"], ["#view-no-links", "#view-links-loading"]);
    }
}

// Append Only New Links (No Full Re-render)
function appendLinks(urls) {
    const fragment = document.createDocumentFragment();
    urls.forEach(url => fragment.appendChild(createLinkItem(url)));
    linksContainer.appendChild(fragment);
}

// Create Link Item Element
function createLinkItem(data) {

    // Create a new div and apply linkCard template
    const div = document.createElement("div");
    div.setAttribute("data-id", Object.getOwnPropertyDescriptor(data, "_id").value); // TODO: Figure out why data["_id"] = undefined
    div.innerHTML = linkCard.trim();
    div.style.width = "100%";

    // Select elements using updated data attributes
    const icon = div.querySelector("[data-lc-icon]");
    const shortUrlTitle = div.querySelector("[data-lc-short-url]");
    const originalUrl = div.querySelector("[data-lc-original-url]");
    const clicks = div.querySelector("[data-lc-clicks]");
    const createdAt = div.querySelector("[data-lc-created-at]");

    icon.src = `https://cdn.shortnx.in/images/icons/?url=${data.originalUrl}`;

    shortUrlTitle.textContent = data.title || `shortnx.in/${data.shortUrlId}`;
    shortUrlTitle.href = `${window.origin}/${data.shortUrlId}`;

    originalUrl.textContent = data.originalUrl.replace(/^https?:\/\//, "");
    originalUrl.href = data.originalUrl;

    clicks.textContent = data.clicks;

    createdAt.textContent = new Date(data.createdAt).toLocaleString("en-US", {
        month: "short", day: "numeric", year: "numeric"
    });

    return div;
}

(function () {

    // Add Event Listener (Event Delegation)
    linksContainer.addEventListener("click", function (event) {
        const target = event.target;
        if (target.closest("[data-lc-btn-copy]")) {
            const linkCard = target.closest("[data-id]");
            if (!linkCard) return;
            const shortUrl = linkCard.querySelector("[data-lc-short-url]").href;

            navigator.clipboard.writeText(shortUrl)
                .then(() => Toast.getInstance().showToast("Copied to clipboard"));
        }
    });

    // Initial Load
    loadLinks(currentPage).then(success => {
        if (!success) {
            switchVisibilities(["#view-no-links"], ["#view-links", "#view-links-loading"]);
        }
    });
})();


