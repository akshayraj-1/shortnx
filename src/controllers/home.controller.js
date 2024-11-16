const { isAuthenticated } = require("../middlewares/auth.middleware");


// Render the home or dashboard page based on the user authentication
function getHome(req, res) {
    isAuthenticated(req)
        ? res.redirect("/dashboard")
        : res.render("pages/home", { title: "URL Shortener" });
}

module.exports = { getHome };