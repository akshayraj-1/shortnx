const { isAuthenticated } = require("../middlewares/auth.middleware");

exports.getHome = (req, res) => {
    isAuthenticated(req)
        ? res.redirect("/dashboard")
        : res.render("pages/home", { title: "URL Shortener" });
}