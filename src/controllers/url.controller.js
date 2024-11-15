const UrlModel = require("../models/url.model");
const UrlAnalyticsModel = require("../models/urlanalytics.model");
const { isAuthenticated, checkUserAuth } = require('../middlewares/auth.middleware');
const { disableCache } = require("../middlewares/cache.middleware");
const clientRequestInfo = require("../utils/requestInfo.util");


exports.createShortenUrl = async (req, res) => {
    const { url } = req.body;
    if (!url || !new RegExp(/(^https:\/\/.*)|(^http:\/\/.*)/g).test(url)) {
        res.status(400).json({success: false, message: "Please enter a valid url"});
        return;
    }
    const userId = isAuthenticated(req) ? req.session.user._id : null;

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

exports.getShortenUrls = [checkUserAuth, (req, res, next) => {
    // TODO: Implement get shorten urls of user
}];

exports.getOriginalUrl = [disableCache, async (req, res) => {
    const { shortUrlId } = req.params;

    try {
        const urlDoc = await UrlModel.findOneAndUpdate(
            { shortenUrl: shortUrlId, status: "active" },
            { $inc: { clicks: 1 } }
        );
        if (urlDoc && urlDoc.originalUrl) {
            await updateUrlAnalytics(req, shortUrlId, urlDoc.originalUrl);
            res.status(302).redirect(urlDoc.originalUrl);
        } else {
            res.render("pages/404", {title: "Page Not Found", error: "Url not found"});
        }
    } catch (error) {
        res.render("pages/404", {title: "Page Not Found", error: error.message});
    }
}]


async function updateUrlAnalytics(req, shortUrlId, originalUrl) {
    try {
        const { ip, city, region, country, timezone, deviceType, platform, browser } = await clientRequestInfo(req);
        const urlAnalytics = new UrlAnalyticsModel({
            shortenUrl: shortUrlId,
            originalUrl: originalUrl,
            localIp: ip,
            geoLocation: {
                city: city,
                country: country,
                region: region
            },
            timezone: timezone,
            deviceType: deviceType,
            platform: platform,
            browser: browser
        });
        return await urlAnalytics.save();
    } catch (e) {
        console.log(e);
    }
}
