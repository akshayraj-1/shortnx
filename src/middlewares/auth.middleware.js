exports.isAuthenticated = (req) => {
    const access_token = req.cookies.access_token;
    // TODO: Validate the access token using firebase admin
    return false;
}

exports.checkUserAuth = (req, res, next) => {
    if (this.isAuthenticated(req)) {
        res.locals.user = req.session.user;
        next();
    } else {
        res.redirect("/login");
    }
}