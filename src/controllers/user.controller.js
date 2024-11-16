const { checkUserAuth } = require("../middlewares/auth.middleware");

const getDashboard = [checkUserAuth, (req, res, next) => {
    res.render("pages/dashboard", { title: res.locals.user.name });
}];


module.exports = { getDashboard };

