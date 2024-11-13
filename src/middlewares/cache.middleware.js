exports.enableCache = (req, res, next) => {
    res.set("Cache-Control", "public, max-age=31536000");
    res.set("Expires", new Date(Date.now() + 31536000000).toUTCString());
    next();
}

exports.disableCache = (req, res, next) => {
    res.set("Cache-Control", "no-cache, no-store, must-revalidate");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    next();
}