// Importing modules
const express = require("express");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const path = require("path");
const dotenv = require("dotenv");
const ejsmate = require("ejs-mate");

// Controllers
const homeController = require("./controllers/home.controller");
const authController = require("./controllers/auth.controller");
const userController = require("./controllers/user.controller");
const urlController = require("./controllers/url.controller");

// Environment Variables
dotenv.config({ path: path.join(__dirname, `.env.${process.env.NODE_ENV?.trim()}`) });

// Express Setup
const app = express();
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.static(path.join(__dirname, "components")));
// extended -> true (parse with qs lib: can parse nested objects);
// extended -> false (parse with querystring lib: cannot parse nested objects)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    resave: false,
    saveUninitialized: true, // true -> session will be created even if there is no data being stored
    secret: process.env.SESSION_SECRET,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        dbName: "url-shortener",
        crypto: { secret: process.env.SESSION_SECRET }
    }),
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// EJS/View Engine Setup
app.engine("ejs", ejsmate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Home routes
app.get("/", homeController.getHome);

// Other Routes
app.get("/cookies-policy", (req, res) => {
    res.render("pages/legal/cookies-policy", { title: "Cookie Policy - Shortn" });
});
app.get("/privacy-policy", (req, res) => {
    res.render("pages/legal/privacy-policy", { title: "Privacy Policy - Shortn" });
});
app.get("/terms-of-services", (req, res) => {
    res.render("pages/legal/terms-of-services",  { title: "Terms of Services - Shortn" });
});

// Auth routes
// Could have used router for these kind of routes but why bother
app.get("/auth/login", authController.getLogin);
app.get("/auth/signup", authController.getSignup);
app.get("/auth/google", authController.getGoogleAuth);
app.post("/api/auth/login", authController.login);
app.post("/api/auth/signup", authController.signUp);
app.get("/api/auth/google/callback/", authController.googleAuth);

// User routes
app.get("/dashboard", userController.getDashboard);

// Shorten URL routes
app.post("/api/short-url/create", urlController.createShortenURL);
app.get("/api/short-url/get/:userId", urlController.getShortenUrls);
app.get("/:shortUrlId", urlController.getOriginalUrl);

// 404
app.use((req, res) => {
    res.status(404).render("pages/404", { title: "Page Not Found" });
});


// Connect to database
console.warn("Connecting to database...");
mongoose.connect(process.env.MONGO_URI, { dbName: "url-shortener", serverSelectionTimeoutMS: 5000 }).then(_ => {
    console.info("Connected to database!");
    app.listen(process.env.PORT, () => {
        console.info(`Server running on port: ${process.env.PORT}`);
    });
}).catch(error => console.error(`Failed to connect to database: ${error}`));