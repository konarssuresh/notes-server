const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const { connectDb } = require("./config/database");
const authRouter = require("./routes/auth");
const notesRouter = require("./routes/notes");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", notesRouter);

connectDb()
  .then(() => {
    console.log("db connection established");
    app.listen(8000, (err) => {
      if (!err) {
        console.log("app listening on port 8000");
      }
    });
  })
  .catch((e) => {
    console.log(e);
    console.log("connection to db is failed");
  });
