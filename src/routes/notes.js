const express = require("express");
const { validateUser } = require("../middleware/auth");

const notesRouter = express.Router();

notesRouter.get("/test", validateUser, (req, res) => {
  console.log("sending response");
  res.send("test notes api");
});

module.exports = notesRouter;
