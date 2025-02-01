const mongoose = require("mongoose");
const UrlModel = require("../models/url.model");
const UrlAnalyticsModel = require("../models/urlanalytics.model");
const { clientRequestInfo } = require("../utils/clientInfo.util");

/**
 *
 * @param {Boolean} success
 * @param {Error|String|null} message
 * @param {any|null} data
 * @returns {{success: Boolean, message: String|null, data: any|null}}
 */
function returnResponse(success, message = null, data = null) {
    message = typeof message === "object" && message instanceof mongoose.Error ? message.message : "Something went wrong";
    return { success, message, data };
}

/**
 * Create Shorten URL
 * @param {{title: String|null, targetUrl: String, shortUrlId: (String|null), creator: (String|null), comments: (String|null)}} payload
 * @returns {Promise<{success: Boolean, message: (String|null), data: (*|null)}>}
 */
async function createShortURL(payload) {
    try {
        const { title, targetUrl, shortUrlId, creator, comments } = payload;
        // Sanitize Input
        if (!targetUrl || !/^https?:\/\/.*$/.test(targetUrl)) {
            console.log(`URL SERVICE ERROR: Invalid Target URL: ${targetUrl}`);
            return returnResponse(false, "Invalid Target URL", null);
        }

        const parsedTargetURL = URL.parse(targetUrl);
        const parsedServerURL = URL.parse(process.env.SERVER_BASE_URL);

        if (parsedTargetURL.hostname === parsedServerURL.hostname) {
            return returnResponse(false, "URL is already a Short URL", null);
        }

        const urlDoc = new UrlModel({
            title: title || null,
            originalUrl: targetUrl,
            shortUrlId: shortUrlId ? shortUrlId : Math.random().toString(36).slice(2, 8),
            creator: creator || null,
            comments: comments || null
        });

        const result = await urlDoc.save();
        return returnResponse(true, "Url created successfully", result);

    } catch (error) {
        console.log(`URL SERVICE ERROR: ${error.message}`);
        return returnResponse(false, error, null);
    }
}

/**
 * Get the Target URL
 * @param {String} shortUrlId
 * @returns {Promise<{success: Boolean, message: (String|null), data: (String|null)}>}
 */
async function getTargetURL(shortUrlId) {
    try {
        const { originalUrl } = await UrlModel.findOne({
            shortUrlId: shortUrlId,
            status: "active"
        }, { originalUrl: 1, _id: 0 }).lean();

        if (!originalUrl) {
            return returnResponse(false, "Url not found", null);
        }

        return returnResponse(true, "Url found", { originalUrl });

    } catch (error) {
        console.log(`URL SERVICE ERROR: ${error.message}`);
        return returnResponse(false, error, null);
    }
}

/**
 * Update URL Analytics
 * @param {*} req
 * @param {String} shortUrlId
 * @param {String} originalUrl
 * @returns {Promise<{success: Boolean, message: (String|null), data: (*|null)}>}
 */
async function updateURLAnalytics(req, shortUrlId, originalUrl) {
    try {
        const { ip, city, region, country, timezone, deviceType, platform, browser } = await clientRequestInfo(req);

        const urlAnalyticsDoc = new UrlAnalyticsModel({
            shortenUrl: shortUrlId,
            originalUrl: originalUrl,
            localIp: ip,
            geoLocation: { city, country, region },
            timezone, deviceType, platform, browser
        });

        await UrlModel.updateOne({
            shortUrlId: shortUrlId,
            status: "active"
        }, { $inc: { clicks: 1 } });

        const result = await urlAnalyticsDoc.save();
        return returnResponse(true, "Url analytics updated successfully", result);

    } catch (error) {
        console.log(`URL SERVICE ERROR: ${error.message}`);
        return returnResponse(false, error, null);
    }
}

// TODO: Implement Update URL method
// TODO: Implement Delete URL method
// TODO: Implement Get All URLs method (User's URLs)


module.exports = { createShortURL, getTargetURL, updateURLAnalytics };