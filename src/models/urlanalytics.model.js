const mongoose = require("mongoose");

const UrlAnalyticsSchema = new mongoose.Schema({
    shortUrlId: {
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

const UrlAnalyticsModel = mongoose.model("UrlAnalytics", UrlAnalyticsSchema);

module.exports = UrlAnalyticsModel;