const { isAuthenticated } = require("../middlewares/auth.middleware");


// Render the home or dashboard page based on the user authentication
async function getHome(req, res) {
    await isAuthenticated(req)
        ? res.redirect("/dashboard")
        : res.render("pages/home", { title: "URL Shortener" });
}

module.exports = { getHome };