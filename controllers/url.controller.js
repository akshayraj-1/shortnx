const UAParser = require("ua-parser-js");
const { isAuthenticated } = require('../middlewares/auth.middleware');

const UrlModel = require("../models/url.model");
const UrlAnalyticsModel = require("../models/urlanalytics.model");

const parser = new UAParser();

exports.createShortenUrl = async (req, res) => {
    try {
        const { url } = req.body;
        if (!url || !new RegExp(/(^https:\/\/.*)|(^http:\/\/.*)/g).test(url)) {
            return res.status(400).json({ success: false, message: "Please enter a valid url" });
        }
        const userId = isAuthenticated(req) ? req.session.user._id : null;
        const urlDoc = new UrlModel({
            originalUrl: url,
            shortenUrl: Math.random().toString(36).slice(2, 10),
            creator: userId
        });
        await urlDoc.save();
        return res.json({ success: true, message: "Url created successfully", data: { originalUrl: url, shortenUrl: req.headers.host + "/" + urlDoc.shortenUrl } });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

exports.getOriginalUrl = async (req, res) => {
   try {
       const { shortUrlId } = req.params;
       const urlDoc = await UrlModel.findOneAndUpdate(
           { shortenUrl: shortUrlId, status: "active" },
           { $inc: { clicks: 1 } }
       );
       if (urlDoc && urlDoc.originalUrl) {
           await updateUrlAnalytics(req, shortUrlId, urlDoc.originalUrl)
           return res.redirect(urlDoc.originalUrl);
       } else {
           throw new Error("Url not found");
       }
   } catch (error) {
       console.error(error);
       res.render("pages/404", { title: "Page Not Found", error: error.message });
   }
}


async function updateUrlAnalytics(req, shortUrlId, originalUrl) {
    const localIp = req.ip;
    const response  = await fetch("https://ipinfo.io/" + localIp + "/json");
    const data = await response.json();
    const geoLocation = {
        city: data?.city,
        country: data?.country,
        region: data?.region
    }
    const uaResults = parser.setUA(req.headers["user-agent"]).getResult();
    const urlAnalytics = new UrlAnalyticsModel({
        shortenUrl: shortUrlId,
        originalUrl: originalUrl,
        localIp,
        geoLocation,
        userAgent: req.headers["user-agent"],
        deviceType: uaResults.device.type,
        platform: uaResults.os.name
    });
    return await urlAnalytics.save();
}
