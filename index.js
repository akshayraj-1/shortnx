const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

const path = require("path");
const dotenv = require("dotenv");
const ejsmate = require("ejs-mate");

const { isAuthenticated, protectedRoute } = require("./middlewares/auth.middleware");

const CURRENT_ENV = (process.env.NODE_ENV || 'development').trim();
console.warn(`[server] Current Environment: ${CURRENT_ENV}`);
dotenv.config({path: `.env.${CURRENT_ENV}`});
const PORT = process.env.PORT || 3939;
const MONGO_DB_URL = process.env.MONGO_DB_URL;

const app = express();
app.engine("ejs", ejsmate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}))
app.use(express.json());

// console.warn("[server] Connecting to database...");
// mongoose.connect(MONGO_DB_URL, { dbName: "url-shortener" }).then(_ => {
//     app.listen(PORT, () => {
//         console.info("[server] Connected to database");
//         console.info(`[server] Server running on port: ${PORT}`);
//     });
// }).catch(error => console.error(`[server] Failed to connect to database: ${error}`));

app.get("/", (req, res) => {
    if (isAuthenticated(req)) {
        res.redirect("/user-dashboard");
    } else {
        res.render("index", { title: "URL Shortener" });
    }
});

app.get("/login", (req, res) => {
    if (isAuthenticated(req)) {
        res.redirect("/user-dashboard");
    } else {
        res.render("login", { title: "Login | URL Shortener" });
    }
});

app.get("/signup", (req, res) => {
    if (isAuthenticated(req)) {
        res.redirect("/user-dashboard");
    } else {
        res.render("signup", { title: "Signup | URL Shortener" });
    }
});

app.get("/user-dashboard", protectedRoute, (req, res) => {
    res.render("user-dashboard", { title: res.locals.user.name });
});


// For Non-Authenticated Users
app.get("short-url", (req, res) => {
    const { url } = req.query;
    if (!url) {
        res.json({ success: false, message: "URL is required" });
        return;
    }
    const shortenId = Math.random().toString(36).slice(2, 12);

});


// test
app.listen(PORT, () => {
    console.info("[server] Connected to database");
    console.info(`[server] Server running on port: ${PORT}`);
});

