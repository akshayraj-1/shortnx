const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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
        required: true
    },
    password: {
        type: String,
        required: this.provider === "email"
    },
    photoUrl: {
        type: String,
        default: "/images/user-avatar.png"
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
    isEmailVerified: {
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

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;