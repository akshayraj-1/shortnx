const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    userId: {
        type: String,
        unique: true
    },
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        required: this.provider === "email"
    },
    picture: {
        type: String,
        default: "/images/user_avatar.png"
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },
    provider: {
        type: String,
        required: true,
        enum: ["email", "google"],
    },
    verified: {
        type: Boolean,
        default: false
    },
    lastLogin: {
        type: String,
        default: Date.now()
    },
    refreshToken: {
        type: String,
        default: null
    }
}, { timestamps: true, versionKey: false });

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;