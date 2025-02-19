function getElementsRef(target) {
    const elements = [];
    if (typeof target === "string") {
        if (target.startsWith("#")) {
            elements.push(document.getElementById(target.slice(1)));
        } else if (target.startsWith(".")) {
            elements.push(...document.getElementsByClassName(target.slice(1)));
        } else {
            throw new Error("Invalid target type");
        }
    } else if (target instanceof Element) {
        elements.push(target);
    } else {
        throw new Error("Invalid target type");
    }

    return elements;
}


const elementDisplayValue = new WeakMap();
export function toggleVisibility(target, forceVisible) {
    const elements = getElementsRef(target);
    elements.forEach(element => {

        if (element === null) return;

        if (!elementDisplayValue.has(element)) {
            // if contains any tailwind display class like flex or grid
            const computedDisplay = getComputedStyle(element).display;
            let display = "";
            if (element.classList.contains("flex")) display = "flex";
            else if (element.classList.contains("grid")) display = "grid";
            else if (computedDisplay != null) display = computedDisplay;
            elementDisplayValue.set(element, display);
        }
        if (forceVisible === true) {
            element.removeAttribute("data-hidden");
            element.classList.remove("hidden");
        } else if (forceVisible === false) {
            element.setAttribute("data-hidden", "true");
            element.classList.add("hidden");
        } else {
            const isHidden = element.getAttribute("data-hidden") === "true" ||
                                    element.classList.contains("hidden") ||
                                    getComputedStyle(element).display === "none";

            if (isHidden) {
                element.removeAttribute("data-hidden");
                element.classList.remove("hidden");
            } else {
                element.setAttribute("data-hidden", "true");
                element.classList.add("hidden");
            }
        }
    });
}

export function switchVisibilities(toBeVisible = [], toBeHidden = []) {
    toBeVisible.forEach(target => toggleVisibility(target, true));
    toBeHidden.forEach(target => toggleVisibility(target, false));
}


const anchorHrefs = new WeakMap();
export function toggleDisable(target, forceDisable = false) {
    const elements = getElementsRef(target);
    elements.forEach(element => {
        if (forceDisable) {
            if (element.tagName === "A") {
                anchorHrefs.set(element, element.href);
                element.removeAttribute("href");
                element.classList.add("opacity-40", "hover:shadow-none", "pointer-events-none");
            } else {
                element.disabled = true;
                element.classList.add("disabled:opacity-40", "disabled:hover:shadow-none");
            }
        } else {
            if (element.tagName === "A") {
                const enabled = element.hasAttribute("href");
                if (enabled) {
                    // Disabling
                    anchorHrefs.set(element, element.href);
                    element.removeAttribute("href");
                    element.classList.add("opacity-40", "hover:shadow-none", "pointer-events-none");
                } else {
                    // Enabling
                    element.setAttribute("href", anchorHrefs.get(element));
                    element.classList.remove("opacity-40", "hover:shadow-none", "pointer-events-none");
                    anchorHrefs.delete(element);
                }
            } else {
                const enabled = !element.disabled;
                if (enabled) {
                    // Disabling
                    element.disabled = true;
                    element.classList.add("disabled:opacity-40", "disabled:hover:shadow-none");
                } else {
                    // Enabling
                    element.disabled = false;
                    element.classList.remove("disabled:opacity-40", "disabled:hover:shadow-none");

                }
            }
        }
    });
}

const btnTextColors = new WeakMap();
export function toggleButtonLoading(btn, loading = false) {
    if (btnTextColors.has(btn)) {
        btnTextColors.set(btn, getComputedStyle(btn).color);
    }
    btn.disabled = loading;
    if (loading) {
        btn.style.color = "transparent";
        btn.classList.add("disabled:bg-opacity-40", "disabled:hover:shadow-none");
        let loader = btn.querySelector(".dot-loader");
        if (!loader) {
            loader = document.createElement("div");
            loader.classList.add("dot-loader", "absolute", "top-1/2", "left-1/2", "-translate-y-1/2", "-translate-x-1/2");
            loader.style.width = "32px";
            btn.prepend(loader);
        }
    } else {
        btn.style.color = btnTextColors.get(btn) || "#fff";
        btn.classList.remove("disabled:bg-opacity-40", "disabled:hover:shadow-none");
        const loader = btn.querySelector(".dot-loader");
        if (loader) btn.removeChild(loader);
        btnTextColors.delete(btn);
    }
}