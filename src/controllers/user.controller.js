const { validateAuthUser } = require("../middlewares/auth.middleware");


const getDashboard = [validateAuthUser, (req, res, next) => {
    const query = req.query;
    if (!query.tab) {
        return res.redirect("/u/dashboard/?tab=overview");
    }
    res.render("layouts/dashboard-layout.ejs", { title: "Shortnx - Dashboard" });
}];

const getTabContent = [validateAuthUser, async (req, res) => {
    const { tab } = req.params;
    switch (tab.toLowerCase()) {
        case "overview":
            res.render("pages/dashboard/overview.ejs");
            break;
        case "analytics":
            res.render("pages/dashboard/analytics.ejs");
            break;
        case "links":
            res.render("pages/dashboard/links.ejs");
            break;
        case "pages":
            res.render("pages/dashboard/pages.ejs");
            break;
        case "settings":
            res.render("pages/dashboard/settings.ejs");
            break;
    }
}];

module.exports = { getDashboard, getTabContent };

