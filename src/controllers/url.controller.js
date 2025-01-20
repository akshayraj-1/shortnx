const UrlModel = require("../models/url.model");
const UrlAnalyticsModel = require("../models/urlanalytics.model");
const { isAuthenticated, validateAuthUser } = require('../middlewares/auth.middleware');
const { disableCache } = require("../middlewares/cache.middleware");
const clientRequestInfo = require("../utils/clientInfo.util");
const getMetaData = require("../utils/metadata.util");
const customRedis = require("../services/custom-redis");

/**
 * @throws { Error } - Can throw error
 */
async function updateUrlAnalytics(req, shortUrlId, originalUrl) {
    const { ip, city, region, country, timezone, deviceType, platform, browser } = await clientRequestInfo(req);
    const urlAnalytics = new UrlAnalyticsModel({
        shortenUrl: shortUrlId,
        originalUrl: originalUrl,
        localIp: ip,
        geoLocation: { city, country, region },
        timezone, deviceType, platform, browser
    });
    return await urlAnalytics.save();
}

// Create shorten url
async function createShortenURL(req, res) {
    const { url } = req.body;
    if (!url || !/^https?:\/\/.*$/.test(url)) {
        return res.status(400).json({ success: false, message: "Please enter a valid url" });
    }

    const userUrl = URL.parse(url);
    const serverUrl = URL.parse(process.env.SERVER_BASE_URL);
    if (userUrl.hostname === serverUrl.hostname || userUrl.hostname === req.hostname) {
        return res.status(400).json({ success: false, message: "Url is already a shorten url" });
    }

    const userId = await isAuthenticated(req, res) ? req.session.user.userId : null;

    try {
        const urlDoc = new UrlModel({
            originalUrl: url,
            shortenUrl: Math.random().toString(36).slice(2, 8),
            creator: userId
        });
        await urlDoc.save();
        res.status(201).json({
            success: true,
            message: "Url created successfully",
            data: { originalUrl: url, shortenUrl: process.env.SERVER_BASE_URL + "/" + urlDoc.shortenUrl }
        });
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
}

// Get the original url
const getOriginalURL = [disableCache, async (req, res) => {
    const { shortUrlId } = req.params;
    let originalUrl = "";
    try {

        // Check if the request has been cached previously by the same ip address
        // If yes, return the cached response
        // If no, fetch the original url from the database and update the analytics

        const cachedResponse = await customRedis.get(shortUrlId + "_" + req.ip);
        if (cachedResponse) {
            console.log("Cache hit: ", cachedResponse);
            const { originalUrl, meta } = JSON.parse(cachedResponse);
            return res.render("pages/redirect", { meta, title: "Shortnx - URL Shortener", url: originalUrl });
        }

        const urlDoc = await UrlModel.findOneAndUpdate(
            { shortenUrl: shortUrlId, status: "active" },
            { $inc: { clicks: 1 } }
        );
        originalUrl = urlDoc?.originalUrl || null;
        if (!originalUrl)  throw new Error("Url not found");
        await updateUrlAnalytics(req, shortUrlId, originalUrl);
        const metadata = await getMetaData(originalUrl);
        res.render("pages/redirect", { meta: metadata, title: "Shortnx - URL Shortener", url: originalUrl });
    } catch (error) {
        if (!originalUrl) res.render("pages/404", { title: "Page Not Found", error: error.message });
        else res.render("pages/redirect", { meta: {}, title: "Shortnx - URL Shortener", url: originalUrl });
    }
}];

module.exports = { createShortenURL, getOriginalURL };