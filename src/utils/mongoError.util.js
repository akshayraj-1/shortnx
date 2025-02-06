// Helper function to get more precise mongoose error messages
const mongoose = require("mongoose");

/**
 * Get a short message for the error that happened
 * @param {mongoose.Error} error
 * @returns {String} message
 */
function handleMongooseError(error) {
    switch (error.name) {
        case "ValidationError": {
            return error.errors[Object.keys(error.errors)[0]].message;
        }
        case "CastError": {
            return `Resource not found: ${error.value}`;
        }
        case "MongoError":
        case "MongoServerError": {  // Adding MongoServerError as it's common
            if (error.code === 11000) {
                const field = Object.keys(error.keyPattern)[0];
                return `${field} already exists`;
            }
            return error.message;
        }
        case "DocumentNotFoundError": {
            return "Document not found";
        }
        case "VersionError": {
            return "Document version conflict";
        }
        default: {
            return "Unknown error";
        }
    }
}

module.exports = { handleMongooseError };