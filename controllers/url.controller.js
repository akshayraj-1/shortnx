const UrlModel = require("../models/url.model");
const UrlAnalyticsModel = require("../models/urlanalytics.model");
const { isAuthenticated } = require('../middlewares/auth.middleware');
const { disableCache } = require("../middlewares/cache.middleware");


exports.createShortenUrl = async (req, res) => {
    try {
        const {url} = req.body;
        if (!url || !new RegExp(/(^https:\/\/.*)|(^http:\/\/.*)/g).test(url)) {
            return res.status(400).json({success: false, message: "Please enter a valid url"});
        }
        const userId = isAuthenticated(req) ? req.session.user._id : null;
        const urlDoc = new UrlModel({
            originalUrl: url,
            shortenUrl: Math.random().toString(36).slice(2, 10),
            creator: userId
        });
        await urlDoc.save();
        return res.status(201).json({
            success: true,
            message: "Url created successfully",
            data: {originalUrl: url, shortenUrl: req.headers.host + "/" + urlDoc.shortenUrl}
        });
    } catch (error) {
        return res.status(500).json({success: false, message: error.message});
    }
}

exports.getOriginalUrl = [disableCache, async (req, res) => {
    console.log(req.url, req.params, req.headers.cookie);
    try {
        const { shortUrlId } = req.params;
        const urlDoc = await UrlModel.findOneAndUpdate(
            { shortenUrl: shortUrlId, status: "active" },
            { $inc: { clicks: 1 } },
        );
        console.log(urlDoc.originalUrl);
        if (urlDoc && urlDoc.originalUrl) {
            await updateUrlAnalytics(req, shortUrlId, urlDoc.originalUrl);
            res.status(302).redirect(urlDoc.originalUrl);
            res.end();
        } else {
            res.render("pages/404", {title: "Page Not Found", error: "Url not found"});
        }
    } catch (error) {
        res.render("pages/404", {title: "Page Not Found", error: error.message});
    }
}]


async function updateUrlAnalytics(req, shortUrlId, originalUrl) {
    try {
        const localIp = req.ip;
        const response = await fetch(process.env.IP_INFO_API + "?ip=" + localIp + "&token=" + process.env.IP_INFO_TOKEN);
        const info = await response.json();
        const urlAnalytics = new UrlAnalyticsModel({
            shortenUrl: shortUrlId,
            originalUrl: originalUrl,
            localIp: info.data?.ip || localIp,
            geoLocation: {
                city: info.data?.city,
                country: info.data?.country,
                region: info.data?.region
            },
            timezone: info.data?.timezone,
            deviceType: info.data?.deviceType,
            platform: info.data?.platform,
            browser: info.data?.browser
        });
        return await urlAnalytics.save();
    } catch (e) {
        console.log(e);
    }
}
