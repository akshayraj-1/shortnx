const UserModel = require("../models/user.model");
const  { isAuthenticated, checkUserAuth } = require('../middlewares/auth.middleware');


// Get Login Page
exports.getLogin = (req, res) => {
    if (isAuthenticated(req)) {
        return res.redirect("/user-dashboard");
    } else {
        return res.render("pages/login", { title: "Login | URL Shortener" });
    }
}

// Get Signup Page
exports.getSignup = (req, res) => {
    if (isAuthenticated(req)) {
        return res.redirect("/user-dashboard");
    } else {
        return res.render("pages/signup", { title: "Signup | URL Shortener" });
    }
}

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email });

    } catch (error) {

    }
}

exports.signupUser = (req, res) => {
    const { name, email, password } = req.body;
}
