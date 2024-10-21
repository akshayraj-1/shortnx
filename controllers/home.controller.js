const { isAuthenticated } = require("../middlewares/auth.middleware");

exports.getHome = (req, res) => {
    if (isAuthenticated(req)) {
        return res.redirect("/user-dashboard");
    } else {
        return res.render("pages/index", { title: "URL Shortener" });
    }
}