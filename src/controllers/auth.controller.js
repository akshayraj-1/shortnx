const { isAuthenticated } = require('../middlewares/auth.middleware');
const { getGoogleOAuthURL, getUserFromAuthCode } = require("../services/google-oauth");
const { generateRandomString } = require("../utils/random.util");
const { hashPassword, comparePassword } = require("../utils/hash.util");
const { getRefreshToken, getAccessToken } = require("../utils/token.util");
const logManager = require("../utils/logManager.util");
const UserModel = require("../models/user.model");

// Render the login page
async function getLogin (req, res) {
    await isAuthenticated(req, res)
        ? res.redirect("/u/dashboard")
        : res.render("pages/login", { title: "Login - Shortnx" });
}

// Render the signup page
async function getSignup (req, res) {
    await isAuthenticated(req, res)
        ? res.redirect("/u/dashboard")
        : res.render("pages/signup", { title: "Sign Up - Shortnx" });
}

// Get the Google auth URL
async function getGoogleAuth (req, res) {
    await isAuthenticated(req, res)
        ? res.redirect("/u/dashboard")
        : res.redirect(getGoogleOAuthURL());
}

// User login with email and password
async function login (req, res) {
    const { email, password } = req.body;
    if (!email || !password) return res.json({ success: false, message: "All fields are required" });
    try {
        const user = await UserModel.findOne({ email, provider: "email" });
        if (!user || !await comparePassword(password, user.password)) {
            return res.json({ success: false, message: "Invalid Credentials" });
        }
        const refreshToken = await getRefreshToken(user.userId);
        const accessToken = await getAccessToken(refreshToken);
        await UserModel.updateOne(
            { email: email },
            { $set: { lastLogin: Date.now(), refreshToken: refreshToken } }
        );
        req.session.access_token = accessToken;
        res.cookie("access_token", accessToken, { httpOnly: true });
        res.status(200).json({ success: true, message: "User logged in successfully" });
    } catch (error) {
        logManager.logError(error);
        res.json({ success: false, message: "Something went wrong" });
    }
}

// User signup with email and password
async function signUp(req, res) {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.json({ success: false, message: "All fields are required" });
    try {
        if (await UserModel.findOne({ email })) {
            return res.json({ success: false, message: "Email already exists" });
        }
        const userId = generateRandomString(32, { symbols: false });
        const refreshToken = await getRefreshToken(userId);
        const accessToken = await getAccessToken(refreshToken);
        const user = new UserModel({
            userId: userId,
            name: name,
            email: email,
            password: await hashPassword(password),
            provider: "email",
            refreshToken: refreshToken,
        });
        await user.save();
        req.session.access_token = accessToken;
        res.cookie("access_token", accessToken, { httpOnly: true });
        res.status(201).json({ success: true, message: "User created successfully" });
    } catch (error) {
        logManager.logError(error);
        res.json({ success: false, message: "Something went wrong" });
    }
}

// User login/signup with Google
async function googleAuth(req, res) {
    const { code } = req.query;
    try {
        const authUser = await getUserFromAuthCode(code);
        const existingUser = await UserModel.findOne({ email: authUser.email });
        let refreshToken;
        if (existingUser) {
            // User already exists but not linked with Google
            if (existingUser.provider === "email") return res.status(302).redirect("/auth/login");
            // User already exists and linked with Google
            refreshToken = await getRefreshToken(existingUser.userId);
            await UserModel.updateOne(
                { email: authUser.email },
                { $set: { lastLogin: Date.now(), refreshToken: refreshToken } }
            );
        } else {
            const userId = generateRandomString(32, { symbols: false });
            refreshToken = await getRefreshToken(userId);
            const user = new UserModel({
                userId: userId,
                name: authUser.name,
                email: authUser.email,
                picture: authUser.picture,
                provider: "google",
                verified: authUser.email_verified,
                refreshToken: refreshToken,
            });
            await user.save();
        }
        const accessToken = await getAccessToken(refreshToken);
        req.session.access_token = accessToken;
        res.cookie("access_token", accessToken, { httpOnly: true });
        res.status(302).redirect("/u/dashboard");
    } catch (error) {
        res.status(302).redirect("/auth/login");
        logManager.logError(error);
    }
}

module.exports = { getLogin, getSignup, getGoogleAuth, login, signUp, googleAuth };