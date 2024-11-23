const { validateAccessToken, decodeToken, getAccessToken } = require("../utils/token.util");
const logManager = require("../utils/logManager.util");
const UserModel = require("../models/user.model");

async function isAuthenticated(req) {
    const accessToken = req.cookies.access_token || req.session.access_token;
    if (!accessToken) return false;
    try {
        const payload = await validateAccessToken(accessToken);
        const user = await UserModel.findOne({ userId: payload.userId });
        if (!user) return false;
        req.session.user = { userId: payload.userId };
        logManager.logInfo("User authenticated:", JSON.stringify(decodeToken(accessToken)));
        return true;
    } catch (error) {
        console.log(error);
        logManager.logError(error);
        if (error.code === "ACCESS_TOKEN_EXPIRED") {
            const { userId } = decodeToken(accessToken);
            const user = await UserModel.findOne({ userId });
            if (!user) return false;
            const refreshToken = user.refreshToken;
            if (!refreshToken) return false;
            const newAccessToken = await getAccessToken(refreshToken);
            req.session.access_token = newAccessToken;
            req.cookies.access_token = newAccessToken;
            req.session.user = { userId };
            logManager.logInfo("User re-authenticated:", JSON.stringify(decodeToken(newAccessToken)));
            return true;
        }
        return false;
    }
}

async function checkUserAuth(req, res, next) {
    const isAuth = await isAuthenticated(req);
    isAuth ? next() : res.redirect("/auth/login");
}

module.exports = { isAuthenticated, checkUserAuth };