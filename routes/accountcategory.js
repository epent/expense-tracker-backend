const express = require("express");

const accountcategoryController = require("../controllers/accountcategory");
const verifyToken = require("../middleware/verify_token");

const router = express.Router();

router.post("/account", verifyToken, accountcategoryController.postAccount);

router.post("/category", verifyToken, accountcategoryController.postCategory);

router.get("/accounts", verifyToken, accountcategoryController.getAccounts);

router.get("/categories", verifyToken, accountcategoryController.getCategories);

module.exports = router;
