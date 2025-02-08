// Helper functions for creating and sending JSON responses
// Added the signatures and comments for convenience

const { Response } = require("express");
const { normalizeError } = require("./error.util");

/**
 * Create JSON response object for sending responses to client
 * @param {number} status
 * @param {boolean} success
 * @param {string} message
 * @param {Error|null} error
 * @param {Object|null} data
 * @returns {{success: boolean, statusCode: number, message: string, error: (Error|null), data: (Object|null)}}
 */
function createJSONResponse(status, success, message, error, data = null) {
    if (!success && error) {
        error = normalizeError(error);
        if (!message) message = error.message;
    }
    return {
        success,
        statusCode: status,
        message,
        error: error instanceof Error ? {
            name: error.name,
            message: error.message
        } : null,
        data
    };
}

/**
 * Create JSON response object for success responses
 * @param {number} status
 * @param {string} message
 * @param {Object|null} data
 * @returns {{success: boolean, statusCode: number, message: string, error: null, data: (Object|null)}}
 */
function createJSONSuccessResponse(status, message, data) {
    return createJSONResponse(status, true, message, null, data);
}


/**
 * Create JSON response Object for failure responses
 * @param {number} status
 * @param {Error} error
 * @param {string|null} message
 * @returns {{success: boolean, statusCode: number, message: string, error: Error, data: null}}
 */
function createJSONFailureResponse(status, error, message = null) {
    return createJSONResponse(status, false, message, error, null);
}

/**
 * Sends the JSON response to the client (Express)
 * @param res
 * @param status
 * @param response
 * @returns {*}
 * @throws {Error} Invalid response object
 */
function sendJSONResponse(res, status, response) {
    if (!res || res instanceof Response) throw new Error("Invalid response object");
    return res.status(status).json(response);
}

/**
 * Sends the success JSON response to client (Express)
 * @param res
 * @param {number} status
 * @param {string} message
 * @param {Object|null} data
 * @returns {*}
 */
function sendJSONSuccess(res, status, message, data) {
    const response = createJSONSuccessResponse(status, message, data);
    return sendJSONResponse(res, status, response);
}

/**
 * Sends the failure JSON response to the client (Express
 * @param res
 * @param {number} status
 * @param {Error|string} error
 * @param {string|null} message
 * @returns {*}
 */
function sendJSONFailure(res, status, error, message) {
    const response = createJSONFailureResponse(status, error, message);
    return sendJSONResponse(res, status, response);
}

module.exports = {
    createJSONResponse,
    createJSONSuccessResponse,
    createJSONFailureResponse,
    sendJSONResponse,
    sendJSONSuccess,
    sendJSONFailure
};



