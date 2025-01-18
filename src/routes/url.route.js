const { Router } = require("express");
const urlController = require("../controllers/url.controller");

const router = Router();

router.post("/create", urlController.createShortenURL);


module.exports = router;