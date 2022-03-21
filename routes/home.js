const express = require("express");

const homeController = require("../controllers/home");
const verifyToken = require("../middleware/verify_token");

const router = express.Router();

router.get("/balances", verifyToken, homeController.getBalances);

module.exports = router;
