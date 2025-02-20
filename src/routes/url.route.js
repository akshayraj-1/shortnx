const { Router } = require("express");
const urlController = require("../controllers/url.controller");

const router = Router();

router.post("/create", urlController.createShortURL);

router.get("/get-user-urls", urlController.getUserURLs);


module.exports = router;