const express = require("express");

const accountcategoryController = require("../controllers/accountcategory");

const router = express.Router();

router.post("/account", accountcategoryController.postAccount);

router.post("/category", accountcategoryController.postCategory);

router.get("/accounts", accountcategoryController.getAccounts);

router.get("/categories", accountcategoryController.getCategories);

module.exports = router;
