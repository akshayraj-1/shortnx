const UserModel = require("../models/user.model");
const { isAuthenticated, checkUserAuth } = require('../middlewares/auth.middleware');
const { signInWithEmail, signUpWithEmail } = require("../services/firebase-services");

// Render the login page
function getLogin (req, res) {
    isAuthenticated(req)
        ? res.redirect("/user-dashboard")
        : res.render("pages/login", { title: "Login | URL Shortener" });
}

// Render the signup page
function getSignup (req, res) {
    isAuthenticated(req)
        ? res.redirect("/user-dashboard")
        : res.render("pages/signup", { title: "Sign Up | URL Shortener" });
}

// User login with email and password
async function login (req, res) {
    const { email, password } = req.body;
    if (!email || !password) return res.json({ success: false, message: "All fields are required" });
    try {
        const response = await signInWithEmail(email, password);
        res.json({ success: true, message: "User logged in successfully", data: response });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// User signup with email and password
async function signUp(req, res) {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.json({ success: false, message: "All fields are required" });
    try {
        const response = await signUpWithEmail(email, password);
        res.json({ success: true, message: "User created successfully", data: response });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error });
    }
}

// User login/signup with google
function googleAuth (req, res) {
    // TODO: Implement google auth
}

module.exports = { getLogin, getSignup, login, signUp, googleAuth };