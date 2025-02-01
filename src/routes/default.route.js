const { Router } = require("express");
const defaultController = require("../controllers/default.controller");
const urlController = require("../controllers/url.controller");

const router = Router();

router.get("/", defaultController.getHome);
router.get("/cookie-policy", defaultController.getCookiePolicy);
router.get("/privacy-policy", defaultController.getPrivacyPolicy);
router.get("/terms-of-services", defaultController.getTermsOfServices);

// Handling shorten urls
router.get("/:shortUrlId", urlController.getTargetURL);


module.exports = router;