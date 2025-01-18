const getMetaData = require("metadata-scraper");
const { isAuthenticated } = require("../middlewares/auth.middleware");

async function getMeta(req, res) {
    const authorized = await isAuthenticated(req, res);
    if (!authorized) return res.status(401).json({ success: false, message: "Unauthorized Access" });

    const { url } = req.body;
    if (!url || !/^https?:\/\/.*$/.test(url)) return res.status(400).json({ success: false, message: "Please enter a valid url" });
    try {
        const metadata = await getMetaData(url);
        res.status(200).json({ success: true, data: metadata });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

}


module.exports = { getMeta };