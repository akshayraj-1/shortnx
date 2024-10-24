const { checkUserAuth } = require("../middlewares/auth.middleware");

exports.getDashboard = [checkUserAuth, (req, res, next) => {
    return res.render("pages/user-dashboard", { title: res.locals.user.name });
}];

exports.getShortenUrls = [checkUserAuth, (req, res, next) => {
    // TODO:
}];