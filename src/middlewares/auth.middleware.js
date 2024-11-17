const  { verifyIdToken } = require("../services/firebase-services");
async function isAuthenticated(req) {
    const idToken = req.cookies.id_token || req.session.id_token;
    if (!idToken) return false;
    try {
        const decodedToken = await verifyIdToken(idToken);
        if (!decodedToken) return false;
        req.session.user = decodedToken;
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function checkUserAuth(req, res, next) {
    const isAuth = await isAuthenticated(req);
    isAuth ? next() : res.redirect("/login");
}

module.exports = { isAuthenticated, checkUserAuth };