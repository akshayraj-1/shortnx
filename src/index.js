// Importing Modules
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");
const path = require("node:path");
const dotenv = require("dotenv");
const ejsmate = require("ejs-mate");

// Importing Routers
const apiRouter = require("./routes/api.route");
const defaultRouter = require("./routes/default.route");
const authRouter = require("./routes/auth.route");
const userRouter = require("./routes/dashboard.route");
const urlRouter = require("./routes/url.route");

// Environment Variables
dotenv.config({ path: path.join(__dirname, `../.env.${process.env.NODE_ENV?.trim()}`) });

// Express Setup
const app = express();

// Middlewares
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.urlencoded({
    extended: true // parse with qs lib: can parse nested objects
    // extended: false // parse with querystring lib: can't parse nested objects
}));
app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize()); // Just to prevent MongoDB injection

// Session Setup
app.use(session({
    resave: false,
    saveUninitialized: false, // true -> session will be created even if there is no data being stored
    secret: process.env.SESSION_SECRET,
    cookie: { secure: process.env.NODE_ENV === "production" },
    store: MongoStore.create({
        // FIXME: Share the same client instance with the express-session middleware
        // Right now we are creating a separate client instance
        mongoUrl: process.env.MONGO_URI,
        dbName: process.env.MONGO_DBNAME,
        autoRemove: "interval",
        autoRemoveInterval: 60 * 24, // 24 hr
        crypto: { secret: process.env.SESSION_SECRET }
    })
}));

// EJS/View Engine Setup
app.engine("ejs", ejsmate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// {
//     // Mimic the delay in the dev environment
//     // Remove in the production stage
//     app.use((req, res, next) => {
//         setTimeout(next, Math.random() * 3000);
//     });
// }


// Routes Setup
// Subdomain Routing for the api routes
app.use((req, res, next) => {
    const hostname = req.hostname;
    if (hostname.match(/^api/)) {
        apiRouter(req, res, next);
    } else {
        next();
    }
})
// Main Domain Routing
app.use("/", defaultRouter);
app.use("/auth/", authRouter);
app.use("/user/", userRouter);
app.use("/url/", urlRouter);

// 404 Page
app.use((req, res) => {
    res.status(404).render("pages/404", { title: "Page Not Found" });
});


// Connect to database
{
    console.log("Connecting to database...");
    mongoose.connect(process.env.MONGO_URI, {
        dbName: process.env.MONGO_DBNAME,
        serverSelectionTimeoutMS: 5000
    }).then(_ => {
        console.info("Connected to database!");
        app.listen(process.env.PORT, () => {
            console.log(`Server running on port: ${process.env.PORT}`);
        });
    }).catch(error => console.error(`Failed to connect to database: ${error}`));
}