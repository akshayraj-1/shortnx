const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
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
        default: null
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

const UrlModel = mongoose.model("Url", urlSchema);

module.exports = UrlModel;