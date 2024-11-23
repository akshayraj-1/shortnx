const UserModel = require("../models/user.model");
const  { verifyIdToken, refreshIdToken } = require("../services/firebase-services");
const logManager = require("../utils/logManager.util");

async function isAuthenticated(req) {
    const idToken = req.cookies.id_token || req.session.id_token;
    const exp = req.session.id_token_exp || 0;
    if (!idToken) return false;

    if (idToken && Date.now() < exp) {
        logManager.logInfo("Token found in session for user:", req.session?.user?.uid);
        return true;
    }
    try {
        const data = await verifyIdToken(idToken);
        req.session.id_token_exp = data.exp;
        req.session.user = { uid: data.uid };
        logManager.logInfo("Token verified for user", req.session.user.uid);
        return true;
    } catch (error) {
        logManager.logError(error);
        logManager.logInfo("Auth Middleware Error:", error.message);
        // Refresh Token if the token is expired
        if (error.code === "auth/id-token-expired") {
            try {
                const user = await UserModel.findOne({ userId: req.session.user.uid }, { refreshToken: 1 });
                const data = await refreshIdToken(user.refreshToken);
                await UserModel.updateOne({ userId: req.session?.user?.uid }, { $set: { refreshToken: data.refresh_token } });
                req.session.id_token_exp = data.exp;
                logManager.logInfo("Token Refreshed for user:", req.session?.user?.uid);
                return true;
            } catch (error) {
                logManager.logError(error);
            }
        }
        return false;
    }
}

async function checkUserAuth(req, res, next) {
    const isAuth = await isAuthenticated(req);
    isAuth ? next() : res.redirect("/auth/login");
}

module.exports = { isAuthenticated, checkUserAuth };