const fs = require("fs");
const path = require("path");

const ERROR_LOG_FILE_PATH = path.join(__dirname, "../logs/error.log");
const INFO_LOG_FILE_PATH = path.join(__dirname, "../logs/info.log");

function checkLogDirectory() {
    if (!fs.existsSync(path.dirname(ERROR_LOG_FILE_PATH))) {
        fs.mkdirSync(path.dirname(ERROR_LOG_FILE_PATH), { recursive: true });
    }
    if (!fs.existsSync(path.dirname(INFO_LOG_FILE_PATH))) {
        fs.mkdirSync(path.dirname(INFO_LOG_FILE_PATH), { recursive: true });
    }
}

function logError(error) {
    checkLogDirectory();
    const isErrorInstance = error instanceof Error;
    const logEntry = `${new Date().toISOString()}: 
    "timestamp": "${new Date().toUTCString()}",
    "code": "${isErrorInstance ? error.code : "NA"}",
    "message": "${isErrorInstance ? error.message : error}",
    "stack": "${isErrorInstance ? error.stack : "NA"}"
`;

    fs.appendFile(ERROR_LOG_FILE_PATH, logEntry, "utf8", (err) => {
        if (err) {
            console.error("Error appending to error log file:", err);
        }
    });
}

function logInfo(...info) {
    checkLogDirectory();
    const logEntry = `${new Date().toISOString()}: 
    "timestamp": "${new Date().toUTCString()}",
    "info": "${info.join(' ')}"
`;

    fs.appendFile(INFO_LOG_FILE_PATH, logEntry, "utf8", (err) => {
        if (err) {
            console.error("Error appending to info log file:", err);
        }
    });
}

module.exports = { logError, logInfo };