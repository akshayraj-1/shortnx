const { checkUserAuth } = require("../middlewares/auth.middleware");

const getDashboard = [checkUserAuth, (req, res, next) => {
    res.render("pages/dashboard", { title: "Dashboard" });
}];


module.exports = { getDashboard };

