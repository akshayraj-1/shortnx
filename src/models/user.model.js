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
    photoUrl: {
        type: String,
        default: "/images/user-avatar.png"
    },
    provider: {
        type: String,
        enum: ["google", "email"],
        required: true
    }
}, { timestamps: true, versionKey: false });

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;