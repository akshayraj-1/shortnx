/**
 * @description
 * Just a helper class for form validation
 * Right now it has just validations for email, password, name,
 * but you can also validate other types of input values using the generic validateInput method
 * Please remember to wrap your given input element in some sort of container like `<div><input type="email"></div>`
 */

class InputValidation {

    /**
     * Generic input validation
     * @param input
     * @param regexp
     * @param errorMessage
     * @returns {boolean}
     */
    static validateInput(input, regexp = null, errorMessage = null) {
        const value = input.value;
        const valid = regexp ? regexp.test(value) : value.length > 0;
        this.toggleErrorState(input, !valid && errorMessage ? errorMessage : null);
        return valid;
    }

    /**
     * Validate email
     * @param input
     * @param showError
     * @returns {boolean}
     */
    static validateEmail(input, showError = true) {
        return this.validateInput(input,
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            showError ? "Please enter a valid email address" : null);
    }

    /**
     * Validate name
     * @param input
     * @param showError
     * @returns {boolean}
     */
    static validateName(input, showError = true) {
        return this.validateInput(input,
            /^[a-zA-Z\s]{6,50}$/,
            showError ? "Name must be between 6-50 chars" : null);
    }

    /**
     * Validate password
     * @param input
     * @param showError
     * @returns {boolean}
     */
    static validatePassword(input, showError = true) {
        let error = null;
        const value = input.value;
        if (value.length < 8 || value.length > 30) {
            error = "Password must be between 8-30 chars";
        } else if (!value.match(/^(?=.*[A-Za-z])(?=.*\d)/)) {
            error = "Password must have at least one letter and number";
        } else if (!value.match(/(?=.*[@$!%*#?&])/)) {
            error = "Password must have at least one special char";
        }
        return this.validateInput(input,
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,30}$/,
            showError ? error : null);
    }

    /**
     * Toggle error state
     * @param input
     * @param message
     */
    static toggleErrorState(input, message = null) {
        const container = input.parentElement;
        let error = container.querySelector(".error-label");
        if (!message) {
            // Remove error
            if (error) {
                input.classList.remove("ring-1", "ring-red-500");
                input.classList.add("focus:ring-1", "focus:ring-slate-300");
                error.remove();
            }
            return;
        }
        // Add error
        input.classList.remove("focus:ring-1", "focus:ring-slate-300");
        input.classList.add("ring-1", "ring-red-500", "focus:ring-1", "focus:ring-red-500");
        input.focus();
        if (error) {
            error.textContent = message;
        } else {
            error = document.createElement("span");
            error.className = "error-label text-[0.8rem] text-red-500";
            error.textContent = message;
            input.insertAdjacentElement("afterend", error);
        }
    }
}