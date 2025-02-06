const UrlModel = require("../models/url.model");
const UrlAnalyticsModel = require("../models/urlanalytics.model");
const { createJSONSuccessResponse, createJSONFailureResponse } = require("../utils/response.util");
const { clientRequestInfo } = require("../utils/clientInfo.util");

/**
 * Create Shorten URL
 * @param {{title: (String|null), targetUrl: String, shortUrlId: (String|null), creator: (String|null), comments: (String|null)}} payload
 * @returns {Promise<{success: Boolean, message: (String|null), data: (*|null)}>}
 */
async function createShortURL(payload) {
    try {
        // Sanitize Input
        const title = payload?.title?.trim() || null;
        const targetUrl = payload?.targetUrl?.trim() || null;
        const shortUrlId = payload?.shortUrlId?.trim().replaceAll(" ", "") || null;
        const creator = payload?.creator ?? null;
        const comments = payload?.comments?.trim() || null;

        if (!targetUrl || !/^https?:\/\/.*$/.test(targetUrl)) {
            console.error(`URL SERVICE ERROR: Invalid target URL: ${targetUrl}`);
            return createJSONFailureResponse(400, "Invalid Target URL");
        }

        const parsedTargetURL = URL.parse(targetUrl);
        const parsedServerURL = URL.parse(process.env.SERVER_BASE_URL);

        if (parsedTargetURL.hostname === parsedServerURL.hostname) {
            return createJSONFailureResponse(409, "URL is already a short URL");
        }

        const urlDoc = new UrlModel({
            title: title || null,
            originalUrl: targetUrl,
            shortUrlId: shortUrlId ? shortUrlId : Math.random().toString(36).slice(2, 8),
            creator: creator || null,
            comments: comments || null
        });

        const result = await urlDoc.save();
        return createJSONSuccessResponse(201, "Url created successfully", result);

    } catch (error) {
        console.log(`URL SERVICE ERROR: ${error.message}`);
        return createJSONFailureResponse(500, error);
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
            return createJSONFailureResponse(404, "Url not found");
        }

        return createJSONSuccessResponse(302, "Url found", { originalUrl });

    } catch (error) {
        console.log(`URL SERVICE ERROR: ${error.message}`);
        return createJSONFailureResponse(500, error);
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