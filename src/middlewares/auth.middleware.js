const { validateAccessToken, decodeToken, getAccessToken } = require("../utils/token.util");
const logManager = require("../utils/logManager.util");
const UserModel = require("../models/user.model");

async function isAuthenticated(req, res) {
    const accessToken = req.cookies.access_token || req.session.access_token;
    try {
        const payload = await validateAccessToken(accessToken);
        // Assign the user details to the session
        if (!req.session || !req.session.user) {
            const user = await UserModel.findOne({ userId: payload.userId });
            if (!user) return false;
            req.session.user = { userId: user.userId, name: user.name, email: user.email };
        }
        logManager.logInfo("Access token validated");
        return true;
    } catch (error) {
        if (error.code === "ACCESS_TOKEN_EXPIRED") {
            const payload = decodeToken(accessToken);
            const user = await UserModel.findOne({ userId: payload.userId });
            if (!user) return false;
            const newAccessToken = await getAccessToken(user.refreshToken);
            // Assign the new access token and the user details to the session
            req.session.access_token = newAccessToken;
            res.cookie("access_token", newAccessToken, { httpOnly: true });
            req.session.user = { userId: user.userId, name: user.name, email: user.email };
            logManager.logInfo("Access token refreshed");
            return true;
        }
        req.session?.destroy();
        return false;
    }
}

async function validateAuthUser(req, res, next) {
    await isAuthenticated(req, res)
        ? next()
        : res.redirect("/auth/login");
}

module.exports = { isAuthenticated, validateAuthUser };