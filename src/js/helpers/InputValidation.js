/**
 * @type {InputValidation}
 * @description
 * Helper class for form input validation.
 * It has some predefined methods for several validations like email, name, password, url etc...
 * but you can also validate other types of input values using the generic `validateInput()` method
 * If you want to show an error message, Please remember to wrap your given input element in some sort of container
 * like `<div><input type="email"></div>`
 *
 * @note
 * You might think this as overkill, instead you can use setCustomValidity() method of HTMLInputElement (https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement/setCustomValidity)
 */

import validator from "../../utils/validator.util";

class InputValidation {

    /**
     * Generic input validation
     * @param {HTMLInputElement} input
     * @param {RegExp} pattern
     * @param {object|null} options
     * @returns {boolean}
     */
    static validateInput(input, pattern, options = {}) {
        options = {
            error: "Please enter a valid value",
            show_error: true,
            ...options
        };
        const value = input.value;
        const valid = validator.validate(value, { pattern })
        this.toggleErrorState(input, !valid && options.show_error ? options.error : null);
        return valid;
    }

    /**
     * Validate email
     * @param {HTMLInputElement} input
     * @param {Object|null} options
     * @returns {boolean}
     */
    static validateEmail(input, options = {}) {
        options = {
            error: "Please enter a valid email address",
            show_error: true,
            ...options
        };
        const isValidEmail = validator.isEmail(input.value);
        this.toggleErrorState(input, !isValidEmail && options.show_error ? options.error : null);
        return isValidEmail;
    }

    /**
     * Validate name
     * @param {HTMLInputElement} input
     * @param {Object|null} options
     * @returns {boolean}
     */
    static validateName(input, options = {}) {
        options = {
            min_len: 6,
            max_len: 50,
            show_error: true,
            ...options
        };
        if (options.min_len || options.max_len) {
            const min = options.min_len ? options.min_len : 6;
            const max = options.max_len ? options.max_len : 50;
            options.error = `Name must be between ${min}-${max} chars`;
        }

        const isValidName = validator.isAlphaNumeric(input.value, {
            min_len: options.min_len,
            max_len: options.max_len,
            whitespace: true
        });
        this.toggleErrorState(input, !isValidName && options.show_error ? options.error : null);
        return isValidName;
    }

    /**
     * Validate password
     * @param {HTMLInputElement} input
     * @param {Object|null} options
     * @returns {boolean}
     */
    static validatePassword(input, options = {}) {
        options = {
            min_len: 8,
            max_len: 30,
            number: true,
            special_char: true,
            error: "Please enter a valid password",
            show_error: true,
            ...options
        };

        const min = options.min_len;
        const max = options.max_len;
        const password = input.value;

        if (options.number && !validator.validate(password, { pattern: /\d/ })) {
            options.error = "Password must have at least one number.";
            this.toggleErrorState(input, options.show_error ? options.error : null);
            return false;
        }

        if (options.special_char && !validator.validate(password, { pattern: /[!@#$%^&*()_+]/ })) {
            options.error = "Password must have at least one special character.";
            this.toggleErrorState(input, options.show_error ? options.error : null);
            return false;
        }

        if (password.length < min || password.length > max) {
            options.error = `Password must be between ${min}-${max} characters.`;
            this.toggleErrorState(input, options.show_error ? options.error : null);
            return false;
        }

        return true;
    }


    /**
     * Validate URL
     * @param {HTMLInputElement} input
     * @param {Object|null} options
     * @returns {boolean}
     */
    static validateURL(input, options = {}) {
        options = {
            protocols: ["http", "https"],
            error: "Please enter a valid url",
            show_error: true,
            ...options
        };
        const isValidURL = validator.isURL(input.value, options);
        this.toggleErrorState(input, !isValidURL && options.show_error ? options.error : null);
        return isValidURL;
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
            error?.remove();
            input.classList.replace("ring-red-500", "focus:ring-slate-300");
            input.classList.remove("ring-1", "focus:ring-red-500", "focus-within:ring-red-300");
            return;
        }

        input.classList.replace("focus:ring-slate-300", "ring-red-500");
        input.classList.add("ring-1", "ring-red-500", "focus:ring-1", "focus:ring-red-500", "focus-within:ring-red-300");
        input.focus();

        if (!error) {
            error = document.createElement("span");
            error.className = "error-label text-[0.8rem] text-red-500";
            input.insertAdjacentElement("afterend", error);
        }
        error.textContent = message;
    }

}

// For Browser (script tag)
if (typeof window !== "undefined" && !window.InputValidation) {
    window.InputValidation = InputValidation;
}

// For ES6 modules
export default InputValidation;