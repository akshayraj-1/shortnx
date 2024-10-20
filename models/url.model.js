const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
    shortenUrl: {
        type: String,
        required: true,
        unique: true
    },
    targetUrl: {
        type: String,
        required: true
    },
    creator: {
        type: mongoose.Types.ObjectId,
        default: "anonymous"
    },
    clicks: {
        type: Number,
        default: 0
    }
});

const UrlModel = mongoose.model("Url", urlSchema);

export default UrlModel;