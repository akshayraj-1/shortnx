const UserModel = require("../models/user.model");
const { isAuthenticated, checkUserAuth } = require('../middlewares/auth.middleware');

// Get Login Page
exports.getLogin = (req, res) => {
    isAuthenticated(req)
        ? res.redirect("/user-dashboard")
        : res.render("pages/login", { title: "Login | URL Shortener" });
}

// Get Signup Page
exports.getSignup = (req, res) => {
    isAuthenticated(req)
        ? res.redirect("/user-dashboard")
        : res.render("pages/signup", { title: "Sign Up | URL Shortener" });
}

exports.login = async (req, res) => {
    const { email, password } = req.body;
    // TODO: Implement login
}

exports.signUp = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.json({ success: false, message: "All fields are required" });
        return;
    }

    try {
        // TODO: Implement the signup
        return res.json({success: true, message: "User created successfully"});
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.code });
    }
}

exports.googleAuth = (req, res) => {
    // TODO: Implement google auth
}
