exports.isAuthenticated = (req) => {
    return req.session && req.session.user;
}

exports.checkUserAuth = (req, res, next) => {
    if (this.isAuthenticated(req)) {
        res.locals.user = req.session.user;
        next();
    } else {
        return res.redirect('/login');
    }
}