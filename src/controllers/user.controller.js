const { validateAuthUser } = require("../middlewares/auth.middleware");

const getDashboard = [validateAuthUser, (req, res, next) => {
    res.render("pages/dashboard", { title: "Dashboard" });
}];


module.exports = { getDashboard };

