function getElementsRef(target) {
    if (typeof target === "string") {
        // Id
        if (target.startsWith("#")) {
            const element = document.getElementById(target.slice(1));
            return element ? [element] : [];
        }
        // Classname
        if (target.startsWith(".")) {
            return Array.from(document.getElementsByClassName(target.slice(1)));
        }
        // Tags
        return Array.from(document.querySelectorAll(target));
    }
    if (target instanceof Element) {
        return [target];
    }
    throw new Error("Invalid target type");
}


const elementDisplayValue = new WeakMap();
export function toggleVisibility(target, forceVisible) {
    const elements = getElementsRef(target);
    elements.forEach(element => {

        if (element === null) return;

        if (!elementDisplayValue.has(element)) {
            let display = getComputedStyle(element).display;
            if (element.classList.contains("flex")) display = "flex";
            else if (element.classList.contains("grid")) display = "grid";
            elementDisplayValue.set(element, display);
        }

        const isHidden = element.getAttribute("data-hidden") === "true" ||
            element.classList.contains("hidden") ||
            getComputedStyle(element).display === "none";

        if (forceVisible ?? isHidden) {
            element.removeAttribute("data-hidden");
            element.classList.remove("hidden");
            element.style.display = elementDisplayValue.get(element) || "block";
        } else {
            element.setAttribute("data-hidden", "true");
            element.classList.add("hidden");
            element.style.display = "none";
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
        if (element.tagName === "A") {
            if (forceDisable ?? element.hasAttribute("href")) {
                // Disable
                anchorHrefs.set(element, element.getAttribute("href") || "");
                element.removeAttribute("href");
                element.classList.add("opacity-40", "hover:shadow-none", "pointer-events-none")
            } else {
                // Enable
                const href = anchorHrefs.get(element);
                if (href) element.setAttribute("href", href);
                element.classList.remove("opacity-40", "hover:shadow-none", "pointer-events-none");
                anchorHrefs.delete(element);
            }
        } else {
            const isDisabled = forceDisable ?? !element.disabled;
            element.disabled = isDisabled;
            element.classList.toggle("disabled:opacity-40", isDisabled);
            element.classList.toggle("disabled:hover:shadow-none", isDisabled);
        }
    });
}

const btnTextColors = new WeakMap();
export function toggleButtonLoading(btn, loading = false) {
    if (!btnTextColors.has(btn)) {
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
export function positionDropdown(dropdown, button, options = {}) {
    const { position = "below", offset = 8, margin = 10 } = options;

    const buttonRect = button.getBoundingClientRect();
    const dropdownRect = dropdown.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top, left;

    // Calculate position
    if (position === "below") {
        top = buttonRect.bottom + offset;
    } else if (position === "above") {
        top = buttonRect.top - dropdownRect.height - offset;
    }

    left = buttonRect.left;

    // Make sure the menu fits within the viewport
    if (left + dropdownRect.width + margin > viewportWidth) {
        left = viewportWidth - dropdownRect.width - margin;
    }

    if (top + dropdownRect.height + margin > viewportHeight) {
        top = position === "below" ? buttonRect.top - dropdownRect.height - offset : buttonRect.bottom + offset;
    }

    dropdown.classList.remove("hidden", "opacity-0", "scale-95");
    dropdown.classList.add("absolute", "z-50", "bg-white", "border", "border-slate-200", "rounded-md", "shadow-md", "min-w-[150px]", "transition-transform", "transition-opacity", "duration-200", "opacity-100", "scale-100");

    dropdown.style.top = `${top}px`;
    dropdown.style.left = `${left}px`;

    console.log("Dropdown position set:", dropdown.style.top, dropdown.style.left);
}

