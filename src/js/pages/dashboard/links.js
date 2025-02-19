import EventBus from "../../helpers/EventBus";
import LinkModal from "../../components/LinkModal";
import Toast from "../../components/Toast";
import { switchVisibilities } from "../../helpers/ui-helpers";

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
    urls.forEach(url => {
        fragment.appendChild(createLinkItem(url));
    });
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
    const btnCopy = div.querySelector("[data-lc-btn-copy]");

    icon.src = `https://cdn.shortnx.in/images/icons/?url=${data.originalUrl}`;

    shortUrlTitle.textContent = data.title || `shortnx.in/${data.shortUrlId}`;
    shortUrlTitle.href = `${window.origin}/${data.shortUrlId}`;

    originalUrl.textContent = data.originalUrl.replace(/^https?:\/\//, "");
    originalUrl.href = data.originalUrl;

    clicks.textContent = `${data.clicks} click${data.clicks !== 1 ? 's' : ''}`;

    createdAt.textContent = getTimeElapsed(data.createdAt);


    btnCopy.addEventListener("click", () => {
        window.navigator.clipboard.writeText(`${window.origin}/${data.shortUrlId}`)
            .then(_ => Toast.getInstance().showToast("Copied to clipboard"));
    });


    return div;
}



function getTimeElapsed(timestamp) {
    const currDate = new Date();
    const actualDate = new Date(timestamp);
    const elapsedSec = Math.floor((currDate - actualDate) / 1000);

    const years = Math.floor(elapsedSec / (365 * 24 * 60 * 60));
    const months = Math.floor(elapsedSec / (30 * 24 * 60 * 60));
    const weeks = Math.floor(elapsedSec / (7 * 24 * 60 * 60));
    const days = Math.floor(elapsedSec / (24 * 60 * 60));
    const hours = Math.floor(elapsedSec / (60 * 60));
    const mins = Math.floor(elapsedSec / 60);

    if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
    if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
    if (weeks > 0) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (mins > 0) return `${mins} min${mins > 1 ? 's' : ''} ago`;
    if (elapsedSec > 30) return "few secs ago";
    return "just now";
}



// Initial Load
loadLinks(currentPage).then(success => {
    if (!success) {
        switchVisibilities(["#view-no-links"], ["#view-links", "#view-links-loading"]);
    }
});
