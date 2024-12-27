const { validateAuthUser } = require("../middlewares/auth.middleware");


const getDashboard = [validateAuthUser, (req, res, next) => {
    res.render("layouts/dashboard-layout.ejs", { title: "Shortnx - Dashboard" });
}];

const getTabContent = [validateAuthUser, async (req, res) => {
    const { tab } = req.params;
    switch (tab.toLowerCase()) {
        case "overview":
            res.render("pages/dashboard/overview.ejs", {
                user: req.user
            });
            break;
        case "analytics":
            res.render("pages/dashboard/analytics.ejs", {
                user: req.user
            });
            break;
        case "links":
            res.render("pages/dashboard/links.ejs", {
                user: req.user
            });
            break;
        case "pages":
            res.render("pages/dashboard/pages.ejs", {
                user: req.user
            });
            break;
        case "settings":
            res.render("pages/dashboard/settings.ejs", {
                user: req.user
            });
            break;
    }
}];

module.exports = { getDashboard, getTabContent };

