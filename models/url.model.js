const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
    shortenUrl: {
        type: String,
        required: true,
        unique: true
    },
    originalUrl: {
        type: String,
        required: true
    },
    creator: {
        type: mongoose.Types.ObjectId,
        default: null
    },
    status: {
        type: String,
        default: "active"
    },
    clicks: {
        type: Number,
        default: 0
    }
}, { timestamps: true, versionKey: false });

const UrlModel = mongoose.model("Url", urlSchema);

module.exports = UrlModel;