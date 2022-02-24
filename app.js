const express = require("express");

const sequelize = require("./util/database");

const app = express();
const port = process.env.PORT || 8080;

app.get("/", (req, res, next) => {
  res.send("Hello world!!!");
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .then(() => {
    app.listen(port);
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
