const express = require("express");
const cors = require("cors");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/media", express.static(path.join(__dirname, "media")));
require("./routes/index")(app);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
