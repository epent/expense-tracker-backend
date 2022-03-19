require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const db = require("./db/models/index");
const transactionRoutes = require("./routes/transaction");
const accountcategoryRoutes = require("./routes/accountcategory");
const homeRoutes = require("./routes/home");
const authRoutes = require("./routes/auth");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(transactionRoutes);
app.use(accountcategoryRoutes);
app.use(homeRoutes);
app.use(authRoutes);

db.sequelize.sync().catch((err) => {
  console.error("Unable to connect to the database:", err);
});

module.exports = app;
