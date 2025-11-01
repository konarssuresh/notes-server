const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const { connectDb } = require("./config/database");
const authRouter = require("./routes/auth");
const notesRouter = require("./routes/notes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

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
