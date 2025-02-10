const { isAuthenticated, validateAuthUser} = require('../middlewares/auth.middleware');
const { disableCache } = require("../middlewares/cache.middleware");
const { getMetaData } = require("../utils/metadata.util");
const { getClientBrowser } = require("../utils/client-info.util");
const urlService = require("../services/url.service");
const customRedis = require("../services/custom-redis.service");


// Create short url
async function createShortURL (req, res) {
    
    const { title, targetUrl, shortUrlId, comments } = req.body;

    try {
        const userId = await isAuthenticated(req, res) ? req.session.user.userId : null;

        // FIXME: Add this check. Currently, it's allowed because I haven't implemented a proper API system for
        //  creating short URLs from the home page or the developer.
        // Check if the user is authenticated
        // if (!userId) {
        //     return res.status(401).json({ success: false, message: "Unauthorized Access" });
        // }

        const response = await urlService.createShortURL({
            title, targetUrl, shortUrlId,
            creator: userId, comments
        });

        return res.status(response.statusCode).json(response);

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Get the original url
const getTargetURL = [disableCache, async function (req, res) {
    const { shortUrlId } = req.params;
    const cacheKey = shortUrlId + "_" + req.ip;

    try {
        // Case 1: Process the cached request
        // If the request has been cached previously with the same IP address
        const cachedResponse = await customRedis.get(cacheKey);
        if (cachedResponse) {
            console.log("Cache hit: ", cachedResponse);
            const { originalUrl, meta } = cachedResponse;
            return res.render("pages/redirect", {
                meta, title: "Shortnx - URL Shortener",
                url: originalUrl
            });
        }

        // Case 2: Process the new request
        const response = await urlService.getTargetURL(shortUrlId);

        if (response.success) {
            const { originalUrl } = response.data;
            const isBrowser = getClientBrowser(req) !== "Unknown";

            // Update the analytics only if the request has been made through browser
            if (isBrowser) {
                await urlService.updateURLAnalytics(req, shortUrlId, originalUrl);
                return res.redirect(originalUrl);
            }

            const metadata = await getMetaData(originalUrl);
            await customRedis.set(cacheKey, JSON.stringify({ originalUrl, meta: metadata }));

            return res.render("pages/redirect", {
                meta: metadata, title: "Shortnx - URL Shortener",
                url: originalUrl
            });

        } else {
            return res.render("pages/404", {
                title: "Page Not Found",
                error: response.message
            });
        }

    } catch (error) {
        res.render("pages/404", {
            title: "Page Not Found",
            error: error.message
        });
    }
}];

// TODO: Implement other methods: Update, Delete, Get Users All Urls etc...

module.exports = { createShortURL, getTargetURL };