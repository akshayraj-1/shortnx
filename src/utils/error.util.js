// Helper function to get more precise mongoose error messages

/**
 * Get a custom error of what happened
 * @param {Error} error
 * @returns {Error} error
 */
function normalizeError(error) {
    // TODO: Add more error types and tune the messages a bit more
    const normalizedError = new Error();
    switch (error.name) {
        case "MongoError":
        case "MongoServerError": {
            if (error.code === 11000) {
                const value = Object.values(error.keyValue)[0];
                normalizedError.message = `${value} already exists`;
                normalizedError.name = "ALREADY_EXISTS";
            }
            break;
        }
        default: {
            normalizedError.message = error.message || "Unknown error";
            normalizedError.name = error.name || "UNKNOWN_ERROR"
        }
    }
    return normalizedError;
}

module.exports = { normalizeError };