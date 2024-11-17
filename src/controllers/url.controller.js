const UrlModel = require("../models/url.model");
const UrlAnalyticsModel = require("../models/urlanalytics.model");
const { isAuthenticated, checkUserAuth } = require('../middlewares/auth.middleware');
const { disableCache } = require("../middlewares/cache.middleware");
const clientRequestInfo = require("../utils/requestInfo.util");

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
    const userId = await isAuthenticated(req) ? req.session.user.uid : null;

    try {
        const urlDoc = new UrlModel({
            originalUrl: url,
            shortenUrl: Math.random().toString(36).slice(2, 10),
            creator: userId
        });
        await urlDoc.save();
        res.status(201).json({
            success: true,
            message: "Url created successfully",
            data: { originalUrl: url, shortenUrl: req.headers.host + "/" + urlDoc.shortenUrl }
        });
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
}

// Get the original url
const getOriginalUrl = [disableCache, async (req, res) => {
    const { shortUrlId } = req.params;

    try {
        const urlDoc = await UrlModel.updateOne(
            { shortenUrl: shortUrlId, status: "active" },
            { $inc: { clicks: 1 } }
        );
        const { originalUrl } = urlDoc;
        if (originalUrl) {
            await updateUrlAnalytics(req, shortUrlId, originalUrl);
            res.status(302).redirect(originalUrl);
        } else {
            res.render("pages/404", {title: "Page Not Found", error: "Url not found"});
        }
    } catch (error) {
        res.render("pages/404", {title: "Page Not Found", error: error.message});
    }
}];

// Get all shorten urls of user
const getShortenUrls = [checkUserAuth, (req, res, next) => {
    // TODO: Implement get shorten urls of user
}];


module.exports = { createShortenUrl, getShortenUrls, getOriginalUrl };