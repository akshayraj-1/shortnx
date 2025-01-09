const tabs = document.querySelectorAll(".tab-default");
const sidebar = document.getElementById("sidebar");
const sidebarContainer = document.getElementById("sidebar-container");
const btnToggleMenu = document.getElementById("btnToggleMenu");

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
    const content = document.getElementById("content");
    content.innerHTML = await fetch(`/u/tabs/${tab}`).then(res => res.text());
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