const { Router } = require("express");

const router = Router();

router.get("/", (req, res) => {
    res.send("Hello API :)");
});

router.get("/ping", (req, res) => {
    res.send("Pong");
});


module.exports = router;