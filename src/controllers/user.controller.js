const { validateAuthUser, isAuthenticated } = require("../middlewares/auth.middleware");


const getDashboard = [validateAuthUser, (req, res, next) => {
    res.render("layouts/dashboard-layout.ejs", { title: "Shortnx - Dashboard" });
}];

const getTabContent = [validateAuthUser, async (req, res) => {
    const { tab } = req.params;
    switch (tab.toLowerCase()) {
        case "overview":
            res.render("pages/dashboard/overview.ejs", {
                title: "Shortnx - Dashboard",
                user: req.user
            });
            break;
    }
}];

module.exports = { getDashboard, getTabContent };

