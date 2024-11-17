const UserModel = require("../models/user.model");
const { isAuthenticated, checkUserAuth } = require('../middlewares/auth.middleware');
const { signInWithEmail, signUpWithEmail } = require("../services/firebase-services");
const getAuthErrorMessage = require("../utils/authError.util");

// Render the login page
async function getLogin (req, res) {
    await isAuthenticated(req)
        ? res.redirect("/dashboard")
        : res.render("pages/login", { title: "Login | URL Shortener" });
}

// Render the signup page
async function getSignup (req, res) {
    await isAuthenticated(req)
        ? res.redirect("/dashboard")
        : res.render("pages/signup", { title: "Sign Up | URL Shortener" });
}

// User login with email and password
async function login (req, res) {
    const { email, password } = req.body;
    if (!email || !password) return res.json({ success: false, message: "All fields are required" });
    try {
        const response = await signInWithEmail(email, password);
        const idToken = response._tokenResponse.idToken;
        const refreshToken = response._tokenResponse.refreshToken;
        await UserModel.updateOne(
            { userId: response.user.uid },
            { $set: { lastLogin: Date.now(), refreshToken: refreshToken } }
        );
        req.session.id_token = idToken;
        res.cookie("id_token", idToken, { httpOnly: true });
        res.status(200).json({ success: true, message: "User logged in successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: getAuthErrorMessage(error) });
    }
}

// User signup with email and password
async function signUp(req, res) {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.json({ success: false, message: "All fields are required" });
    try {
        const response = await signUpWithEmail(email, password);
        const idToken = response._tokenResponse.idToken;
        const refreshToken = response._tokenResponse.refreshToken;
        const user = new UserModel({
            name: name,
            email: email,
            userId: response.user.uid,
            provider: "email",
            refreshToken: refreshToken
        });
        await user.save();
        req.session.id_token = idToken;
        res.cookie("id_token", idToken, { httpOnly: true });
        res.status(201).json({ success: true, message: "User created successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: getAuthErrorMessage(error) });
    }
}

// User login/signup with google
function googleAuth (req, res) {
    // TODO: Implement google auth
}

module.exports = { getLogin, getSignup, login, signUp, googleAuth };