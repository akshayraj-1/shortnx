const { Router } = require("express");
const authController = require("../controllers/auth.controller");

const router = Router();

// Login
router.get("/login", authController.getLogin);
router.post("/login", authController.login);

// Signup
router.get("/signup", authController.getSignup);
router.post("/signup", authController.signUp);

// Google
router.get("/google", authController.getGoogleAuth);
router.get("/google/callback/", authController.googleAuth);

// Logout
router.get("/logout", authController.logout);


module.exports = router;