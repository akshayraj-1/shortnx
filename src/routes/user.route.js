const { Router } = require("express");
const userController = require("../controllers/user.controller");

const router = Router();

router.get("/dashboard", userController.getDashboard);
router.get("/tabs/:tab", userController.getTabContent);

module.exports = router;