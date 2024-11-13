const UserModel = require("../models/user.model");
const  { isAuthenticated, checkUserAuth } = require('../middlewares/auth.middleware');


// Get Login Page
exports.getLogin = (req, res) => {
    if (isAuthenticated(req)) {
        return res.redirect("/user-dashboard");
    } else {
        return res.render("pages/login", { title: "Login | URL Shortener"});
    }
}

// Get Signup Page
exports.getSignup = (req, res) => {
    if (isAuthenticated(req)) {
        return res.redirect("/user-dashboard");
    } else {
        return res.render("pages/signup", { title: "Sign Up | URL Shortener" });
    }
}

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    // TODO: Implement login
}

exports.signupUser = (req, res) => {
    const { name, email, password } = req.body;
    // TODO: Implement signup
}

exports.googleAuth = (req, res) => {
    // TODO: Implement google auth
}
