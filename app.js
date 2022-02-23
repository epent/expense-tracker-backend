const express = require("express");

const app = express();
const port = process.env.PORT || 8080;

app.get("/", (req, res, next) => {
  res.send("Hello world!!!");
});

app.listen(port);
