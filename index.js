const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
const dotenv = require("dotenv");
const ejsmate = require("ejs-mate");

// Controllers
const homeController = require("./src/controllers/home.controller");
const authController = require("./src/controllers/auth.controller");
const userController = require("./src/controllers/user.controller");
const urlController = require("./src/controllers/url.controller");

// Environment Variables
dotenv.config({ path: path.join(__dirname, `.env.${process.env.NODE_ENV?.trim()}`) });

// Express Setup
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// EJS/View Engine Setup
app.engine("ejs", ejsmate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src"));

// Home routes
app.get("/", homeController.getHome);
app.get('/favicon.ico', (req, res) => res.status(204));

// Auth routes
app.get("/login", authController.getLogin);
app.get("/signup", authController.getSignup);
app.post("/login", authController.loginUser);
app.post("/signup", authController.signupUser);

// User routes
app.get("/user-dashboard", userController.getDashboard);
app.get("/user-shorten-urls", userController.getShortenUrls);

// Shorten URL
app.post("/api/short-url", urlController.createShortenUrl);
app.get("/:shortUrlId", urlController.getOriginalUrl);


// Connect to database
console.warn("Connecting to database...");
mongoose.connect(process.env.MONGO_URI, { dbName: "url-shortener" }).then(_ => {
    console.info("Connected to database");
    app.listen(process.env.PORT, () => {
        console.info(`Server running on port: ${process.env.PORT}`);
    });
}).catch(error => console.error(`Failed to connect to database: ${error}`));
