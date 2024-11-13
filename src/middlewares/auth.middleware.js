exports.isAuthenticated = (req) => {
    const access_token = req.cookies.access_token;
    // TODO: Validate the access token using firebase admin
    return false;
}

exports.checkUserAuth = (req, res, next) => {
    if (this.isAuthenticated(req)) {
        // Adding the user object to res.locals for use in views
        res.locals.user = req.session.user;
        next();
    } else {
        return res.redirect("/login");
    }
}