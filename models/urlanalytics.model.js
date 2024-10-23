const mongoose = require("mongoose");

const urlanalyticsSchema = new mongoose.Schema({
    shortenUrl: {
        type: String,
        required: true
    },
    originalUrl: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now()
    },
    localIp: {
        type: String,
        default: null
    },
    geoLocation: {
        type: {
            city: {
                type: String,
                default: null
            },
            country: {
                type: String,
                default: null
            },
            region: {
                type: String,
                default: null
            }
        },
        default: null,
        _id: false
    },
    userAgent: {
        type: String,
        default: null
    },
    deviceType: {
        type: String,
        default: "Unknown"
    },
    platform: {
        type: String,
        default: "Unknown"
    }
}, { versionKey: false });

const UrlAnalyticsModel = mongoose.model("UrlAnalytics", urlanalyticsSchema);

module.exports = UrlAnalyticsModel;