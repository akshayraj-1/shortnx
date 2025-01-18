const tabs = document.querySelectorAll(".tab-default");
const sidebar = document.getElementById("sidebar");
const sidebarContainer = document.getElementById("sidebar-container");
const btnToggleMenu = document.getElementById("btn-toggle-menu");

let abortController = null;

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        if (!tab.classList.contains("tab-active") && window.history.replaceState) {
            tabs.forEach(t => {
                t.classList.remove("tab-active");
                t.classList.add("tab-inactive");
            });
            tab.classList.remove("tab-inactive");
            tab.classList.add("tab-active");
            const tabId = tab.getAttribute("data-tab-id");
            if (window.history.replaceState) {
                window.history.replaceState(null, null, `/u/dashboard?tab=${tabId}`);
            } else {
                window.location.hash = `tab=${tabId}`;
            }
            loadContent(tabId);
            if (window.innerWidth <= 640) toggleSidebar();
        }
    });
});

btnToggleMenu.addEventListener("click", () => toggleSidebar());
sidebarContainer.addEventListener("click", (e) => e.target === sidebarContainer && toggleSidebar());

window.onresize = () => {
    if (window.innerWidth > 640) {
        sidebarContainer.classList.remove("modal-backdrop", "flex", "justify-start");
        sidebarContainer.classList.add("hidden");
    }
}

function toggleSidebar() {
    if (sidebarContainer.classList.contains("hidden")) {
        sidebar.style.transform = "translateX(-100%)";
        sidebarContainer.classList.remove("hidden");
        sidebarContainer.classList.add("modal-backdrop", "flex", "justify-start");
        setTimeout(() => sidebar.style.transform = "translateX(0)", 200);
    } else {
        sidebar.style.transform = "translateX(-100%)";
        setTimeout(() => {
            sidebarContainer.classList.remove("modal-backdrop", "flex", "justify-start");
            sidebarContainer.classList.add("hidden");
            sidebar.style.transform = "translateX(0)";
        }, 200);
    }
}

async function loadContent(tab) {

    // Cancel the previous request
    // TODO: Learn more about AbortController API
    if (abortController) abortController.abort();
    abortController = new AbortController();
    const signal = abortController.signal;

    const content = document.getElementById("content");
    content.innerHTML = "";
    try {
        const response = await fetch(`/u/tabs/${tab}`, { signal });
        const data = await response.text();
        // This is one of the way to load the html context into the DOM by invoking the parser to parse the created range
        // so that the js can also be executed for the dynamic content
        content.innerHTML = "";
        content.append(document.createRange().createContextualFragment(data));
    } catch (error) {
        console.error(error);
    }
}

// Load the selected tab
(function () {
    let urlParams;
    if (!window.history.replaceState) {
        urlParams = new URLSearchParams(window.location.hash.replace("#", ""));
    } else {
        urlParams = new URLSearchParams(window.location.search);
    }
    // Highlight the respective tab
    const tab = urlParams.get("tab");
    loadContent(tab || "links");
    tabs.forEach(t => {
        if (t.getAttribute("data-tab-id") === tab) {
            t.classList.remove("tab-inactive");
            t.classList.add("tab-active");
        } else {
            t.classList.remove("tab-active");
            t.classList.add("tab-inactive");
        }
    });
})();