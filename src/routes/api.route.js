const { Router } = require("express");

const router = Router();

router.get("/ping", (req, res) => {
    res.send("Pong");
});


router.post("/url/create", (req, res) => {
    res.status(200).json({ success: true, message: "Hello from URL API" });
});


module.exports = router;