const { isAuthenticated } = require("../middlewares/auth.middleware");


// Render the home or dashboard page based on the user authentication
async function getHome(req, res) {
    await isAuthenticated(req, res)
        ? res.redirect("/user/dashboard")
        : res.render("pages/home", { title: "Shortnx - URL Shortener" });
}

function getCookiePolicy(req, res) {
    res.render("pages/legal/cookie-policy", { title: "Cookie Policy - Shortnx" });
}

function getPrivacyPolicy(req, res) {
    res.render("pages/legal/privacy-policy", { title: "Privacy Policy - Shortnx" });
}

function getTermsOfServices(req, res) {
    res.render("pages/legal/terms-of-services", { title: "Terms of Services - Shortnx" });
}

module.exports = { getHome, getCookiePolicy, getPrivacyPolicy, getTermsOfServices };