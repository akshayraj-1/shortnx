const { checkUserAuth } = require("../middlewares/auth.middleware");

exports.getDashboard = [checkUserAuth, (req, res, next) => {
    res.render("pages/dashboard", { title: res.locals.user.name });
}];

