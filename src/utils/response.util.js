// Helper functions for creating and sending JSON responses
// Added the signatures and comments for convenience

const { Response } = require("express");
const {handleMongooseError} = require("./mongoError.util");
const mongoose = require("mongoose");


/**
 * Create JSON response object for sending responses to client
 * @param {Number} status
 * @param {Boolean} success
 * @param {String} message
 * @param {Error|null} error
 * @param {Object|null} data
 * @returns {{success: Boolean, statusCode: Number, message: String, error: (Error|null), data: (Object|null)}}
 */
function createJSONResponse(status, success, message, error, data = null) {
    if (!success && !message) {
        if (!error) {
            error = new Error("Unknown error");
            error.name = "UnknownError";
        }
        message = handleMongooseError(error);
    }
    return {
        success,
        statusCode: status,
        message,
        error: error instanceof Error && {
            name: error.name,
            message: error.message
        },
        data
    };
}

/**
 * Create JSON response object for success responses
 * @param {Number} status
 * @param {String} message
 * @param {Object|null} data
 * @returns {{success: Boolean, statusCode: Number, message: String, error: null, data: (Object|null)}}
 */
function createJSONSuccessResponse(status, message, data) {
    return createJSONResponse(status, true, message, null, data);
}


/**
 * Create JSON response Object for failure responses
 * @param {Number} status
 * @param {Error|String} error
 * @param {String|null} message
 * @returns {{success: Boolean, statusCode: Number, message: String, error: Error, data: null}}
 */
function createJSONFailureResponse(status, error, message = null) {
    return createJSONResponse(status, false, typeof error === "string" ? error : message, error, null);
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
 * @param {Number} status
 * @param {String} message
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
 * @param {Number} status
 * @param {Error|String} error
 * @param {String|null} message
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



