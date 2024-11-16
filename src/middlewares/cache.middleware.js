function enableCache(req, res, next) {
    res.set("Cache-Control", "public, max-age=604800"); // 7 days
    res.set("Expires", new Date(Date.now() + 604800000).toUTCString());
    next();
}

function disableCache(req, res, next) {
    res.set("Cache-Control", "no-cache, no-store, must-revalidate");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    next();
}

module.exports = { enableCache, disableCache };