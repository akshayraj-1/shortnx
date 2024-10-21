const  UrlModel = require("../models/url.model");
const { isAuthenticated } = require('../middlewares/auth.middleware');

exports.createShortenUrl = async (req, res) => {
    try {
        const { url } = req.body;
        if (!url || !new RegExp(/(^https:\/\/.*)|(^http:\/\/.*)/g).test(url)) {
            return res.status(400).json({ success: false, message: "Url is required" });
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
           return res.redirect(urlDoc.originalUrl);
       } else {
           throw new Error("Url not found");
       }
   } catch (error) {
       res.render("pages/404", { title: "Page Not Found", error: error.message });
   }
}