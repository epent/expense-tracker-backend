const express = require("express");

const homeController = require("../controllers/home");

const router = express.Router();

router.get("/balances", homeController.getBalances);

module.exports = router;
