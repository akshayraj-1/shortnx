const UserModel = require("../models/user.model");
const querystring = require("querystring");
const { isAuthenticated } = require('../middlewares/auth.middleware');
const { getGoogleOAuthURL, getUserFromAuthCode } = require("../services/google-oauth");
const { getUserByEmail, createUser, createCustomToken, signInWithEmail, signUpWithEmail } = require("../services/firebase-services");
const getAuthErrorMessage = require("../utils/authError.util");
const logManager = require("../utils/logManager.util");

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

// Get the Google auth URL
async function getGoogleAuth (req, res) {
    await isAuthenticated(req)
        ? res.redirect("/dashboard")
        : res.redirect(getGoogleOAuthURL());
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
        logManager.logInfo("IdToken", idToken);
        req.session.id_token = idToken;
        res.cookie("id_token", idToken, { httpOnly: true });
        res.status(200).json({ success: true, message: "User logged in successfully" });
    } catch (error) {
        logManager.logError(error);
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
        logManager.logError(error);
        res.json({ success: false, message: getAuthErrorMessage(error) });
    }
}

// User login/signup with Google
async function googleAuth(req, res) {
    const { code } = req.query;
    try {
        const authUser = await getUserFromAuthCode(code);
        const firebaseUser = await createUserIfNotExists({
            uid: authUser.sub,
            name: authUser.name,
            email: authUser.email,
            photoURL: authUser.picture,
            emailVerified: authUser.email_verified,
            providerId: "google.com"
        });
        console.log(firebaseUser);
        const customToken = await createCustomToken(firebaseUser.uid);
        logManager.logInfo(customToken);
        res.session = { id_token: customToken };
        res.cookie("id_token", customToken, { httpOnly: true });
        res.status(302).redirect("/dashboard");
    } catch (error) {
        res.status(302).redirect("/auth/login");
        logManager.logError(error);
    }
}


async function createUserIfNotExists(user) {
    try {
        const firebaseUser = await getUserByEmail(user.email);
        if (firebaseUser) return firebaseUser;
        return await createUser(user);
    } catch (error) {
        if (error.code === "auth/user-not-found") return await createUser(user);
        throw error;
    }
}

module.exports = { getLogin, getSignup, getGoogleAuth, login, signUp, googleAuth };