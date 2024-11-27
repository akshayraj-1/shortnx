const UrlModel = require("../models/url.model");
const UrlAnalyticsModel = require("../models/urlanalytics.model");
const { isAuthenticated, validateAuthUser } = require('../middlewares/auth.middleware');
const { disableCache } = require("../middlewares/cache.middleware");
const clientRequestInfo = require("../utils/clientRequestInfo.util");
const getMetaData = require("metadata-scraper");

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
async function createShortenUrl(req, res) {
    const { url } = req.body;
    if (!url || !/^https?:\/\/.*$/.test(url)) {
        return res.status(400).json({ success: false, message: "Please enter a valid url" });
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
const getOriginalUrl = [disableCache, async (req, res) => {
    const { shortUrlId } = req.params;
    try {
        const urlDoc = await UrlModel.findOneAndUpdate(
            { shortenUrl: shortUrlId, status: "active" },
            { $inc: { clicks: 1 } }
        );
        const { originalUrl } = urlDoc;
        if (!originalUrl)  throw new Error("Url not found");
        const metadata = await getMetaData(originalUrl);
        await updateUrlAnalytics(req, shortUrlId, originalUrl);
        res.render("pages/redirect", { meta: metadata, title: "Shortn", url: originalUrl });
    } catch (error) {
        console.log(error);
        res.render("pages/404", { title: "Page Not Found", error: error.message });
    }
}];

// Get all shorten urls of user
const getShortenUrls = [validateAuthUser, (req, res, next) => {
    // TODO: Implement get shorten urls of user
}];


module.exports = { createShortenURL: createShortenUrl, getShortenUrls, getOriginalUrl };