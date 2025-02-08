const UrlModel = require("../models/url.model");
const UrlAnalyticsModel = require("../models/urlanalytics.model");
const validator = require("../utils/validator.util")
const { createJSONSuccessResponse, createJSONFailureResponse } = require("../utils/response.util");
const { clientRequestInfo } = require("../utils/clientInfo.util");

/**
 * Create Shorten URL
 * @param {{title: (string|null), targetUrl: string, shortUrlId: (string|null), creator: (string|null), comments: (string|null)}} payload
 * @returns {Promise<{success: boolean, message: (string|null), data: (*|null)}>}
 */
async function createShortURL(payload) {
    try {
        // Sanitize Input
        const title = payload?.title?.trim() || null;
        const targetUrl = payload?.targetUrl?.trim() || null;
        const shortUrlId = payload?.shortUrlId?.trim().replaceAll(" ", "") || Math.random().toString(36).slice(2, 8);
        const creator = payload?.creator ?? null;
        const comments = payload?.comments?.trim() || null;

        // Validate Input
        const parsedServerURL = URL.parse(process.env.SERVER_BASE_URL);
        if (!validator.isURL(targetUrl, { restricted_hostnames: [parsedServerURL.hostname]})) {
            console.error(`URL SERVICE ERROR: Invalid target URL: ${targetUrl}`);
            return createJSONFailureResponse(400, new Error("Invalid target URL"));
        }

        if (!validator.isAlphaNumeric(shortUrlId, { min_len: 3, max_len: 12 })) {
            console.error(`URL SERVICE ERROR: Invalid short URL Id: ${shortUrlId}`);
            return createJSONFailureResponse(400, new Error("Invalid short URL Id"));
        }

        const urlDoc = new UrlModel({
            title: title || null,
            originalUrl: targetUrl,
            shortUrlId: shortUrlId,
            creator: creator || null,
            comments: comments || null
        });

        const result = await urlDoc.save();
        return createJSONSuccessResponse(201, "URL created successfully", result);

    } catch (error) {
        console.log(`URL SERVICE ERROR: ${error.message}`);
        return createJSONFailureResponse(500, error);
    }
}

/**
 * Get the Target URL
 * @param {string} shortUrlId
 * @returns {Promise<{success: boolean, message: (string|null), data: (string|null)}>}
 */
async function getTargetURL(shortUrlId) {
    try {
        const { originalUrl } = await UrlModel.findOne({
            shortUrlId: shortUrlId,
            status: "active"
        }, { originalUrl: 1, _id: 0 }).lean();

        if (!originalUrl) {
            return createJSONFailureResponse(404, new Error("URL not found"));
        }

        return createJSONSuccessResponse(302, "URL found", { originalUrl });

    } catch (error) {
        console.log(`URL SERVICE ERROR: ${error.message}`);
        return createJSONFailureResponse(500, error);
    }
}

/**
 * Update URL Analytics
 * @param {*} req
 * @param {string} shortUrlId
 * @param {string} originalUrl
 * @returns {Promise<{success: boolean, message: (string|null), data: (*|null)}>}
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
        return createJSONSuccessResponse(204, "Url analytics updated successfully", result);

    } catch (error) {
        console.log(`URL SERVICE ERROR: ${error.message}`);
        return createJSONFailureResponse(500, error);
    }
}

// TODO: Implement Update URL method
// TODO: Implement Delete URL method
// TODO: Implement Get All URLs method (User's URLs)


module.exports = { createShortURL, getTargetURL, updateURLAnalytics };