const patterns = {
    email: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$",
    alphaNumeric: "[a-zA-Z0-9]",
    alphaNumericWithSpace: "[a-zA-Z0-9 ]"
};

/**
 * Validate if the input is a valid url
 * @param {string} input
 * @param {Object|null} options
 * @returns {boolean}
 */
function isURL(input, options = {}) {
    if (!input || options === null) return false;
    options = {
        required_protocols: ["http", "https"],
        restricted_hostnames: ["localhost:\\d*"],
        ...options
    };
    let pattern = "";
    const protocols = [...options.required_protocols].join("|");
    pattern = `^(${protocols}):\\/\\/`;
    if (options.restricted_hostnames.length > 0) {
        const restricted = [...options.restricted_hostnames].join("|");
        pattern += `(?!${restricted})`;
    }
    pattern += `([a-zA-Z0-9.-]+(:\\d{1,5})?)`;
    const regex = new RegExp(pattern);
    return regex.test(input);
}

/**
 * Validate iss the input is an email
 * @param input
 * @returns {boolean}
 */
function isEmail(input) {
    const regex = new RegExp(patterns.email);
    return regex.test(input);
}

/**
 * Validate if the given input is alphanumeric or not.
 * You can also pass options like maxLength and minLength via the options arg.
 * @param input
 * @param {Object|null} options
 * @returns {boolean}
 */
function isAlphaNumeric(input, options = {}) {
    if (!input || options === null) return false;
    options = {
        whitespace: false,
        ...options
    };
    let pattern = options.whitespace ? patterns.alphaNumericWithSpace : patterns.alphaNumeric;
    const min = options.min_len || 0;
    const max = options.max_len || "";
    pattern += `{${min},${max}}`;
    pattern += "$";
    const regex = new RegExp(pattern);
    return regex.test(input);
}

/**
 * Validate the input based on given options like charset, pattern, min_len and max_len
 * @param {string} input
 * @param {Object|null} options
 * @returns {boolean}
 */
function validate(input, options = {}) {
    if (!input || options === null) return false;

    let pattern = "";

    if (options.pattern instanceof RegExp) {
        return options.pattern.test(input);
    }

    if (options.charset) {
        pattern = `[${options.charset}]`;
    } else if (options.min_len || options.max_len) {
        const min = options.min_len || 0;
        const max = options.max_len || "";
        pattern = `^.{${min},${max}}$`;
    }

    if (!pattern) return false;

    const regex = new RegExp(pattern);
    return regex.test(input);
}


const validator = { validate, isEmail, isAlphaNumeric, isURL };
export default validator;
export { validate, isEmail, isAlphaNumeric, isURL };


if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = validator;
}
