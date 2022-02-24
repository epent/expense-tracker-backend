const express = require("express");

const accountcategoryController = require("../controllers/accountcategory");

const router = express.Router();

router.post("/account", accountcategoryController.postAccount);

router.post("/category", accountcategoryController.postCategory);

module.exports = router;
