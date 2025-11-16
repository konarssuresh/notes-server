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

const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((u) => u.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS policy: Origin not allowed"), false);
    },
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
    app.listen(process.env.PORT, (err) => {
      if (!err) {
        console.log("app listening on port 8000");
      } else {
        console.log(err);
      }
    });
  })
  .catch((e) => {
    console.log(e);
    console.log("connection to db is failed");
  });
