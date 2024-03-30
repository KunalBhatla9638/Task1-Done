require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

require("./models");

const port = process.env.PORT || 5000;

app.use(bodyParser.json());

app.use("/api/public/images", express.static(path.join(__dirname, "public")));

app.use("/api", require("./routes"));

app.listen(port, () => {
  console.log("Connected to port number :", port);
});
