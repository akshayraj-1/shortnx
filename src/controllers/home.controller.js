const { isAuthenticated } = require("../middlewares/auth.middleware");


// Render the home or dashboard page based on the user authentication
async function getHome(req, res) {
    await isAuthenticated(req, res)
        ? res.redirect("/u/dashboard")
        : res.render("pages/home", { title: "Shortnx - URL Shortener" });
}

module.exports = { getHome };