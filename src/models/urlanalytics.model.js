const mongoose = require("mongoose");

const urlAnalyticsSchema = new mongoose.Schema({
    shortenUrl: {
        type: String,
        required: true
    },
    originalUrl: {
        type: String,
        required: true
    },
    localIp: String,
    geoLocation: {
        type: {
            city: String,
            country: String,
            region: String
        },
        default: null,
        _id: false
    },
    timezone: String,
    deviceType: String,
    platform: String,
    browser: String,
}, { timestamps: true, versionKey: false });

const UrlAnalyticsModel = mongoose.model("UrlAnalytics", urlAnalyticsSchema);

module.exports = UrlAnalyticsModel;