const mongoose = require("mongoose");

const UrlSchema = new mongoose.Schema({
    title: {
        type: String,
        default: null
    },
    shortUrlId: {
        type: String,
        required: true,
        unique: [true, "Shorten url already exists"]
    },
    originalUrl: {
        type: String,
        required: [true, "Please provide a valid url"]
    },
    creator: {
        type: String,
        default: null
    },
    comments: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },
    clicks: {
        type: Number,
        default: 0
    }
}, { timestamps: true, versionKey: false });

const UrlModel = mongoose.model("Url", UrlSchema);

module.exports = UrlModel;