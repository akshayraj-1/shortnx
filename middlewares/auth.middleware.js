function isAuthenticated(req, fallback = null) {
    return req.session && req.session.user;
}

function protectedRoute(req, res, next) {
    if (isAuthenticated(req)) {
        res.locals.user = req.session.user;
        next();
    } else {
        res.redirect('/login');
    }
}

module.exports = { isAuthenticated, protectedRoute }