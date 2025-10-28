const express = require("express");
const bcrypt = require("bcrypt");
const {
  validateSignUpRequest,
  validateLoginRequest,
} = require("../utils/validators");
const { User } = require("../models/user");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpRequest(req);
    const user = new User(req.body);
    await user.hashPassword();
    await user.save();
    res.status(201).send("Signup successful");
  } catch (e) {
    res.status(400).send(`Error - ${e?.message}`);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    console.log(process.env.HELLO);
    validateLoginRequest(req);
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("invalid email or password");
    }

    const isValid = await user.validatePassword(password);
    if (!isValid) {
      throw new Error("invalid email or password");
    }

    const token = user.generateAuthToken();
    res.cookie("token", token);

    res.send("login successful");
  } catch (e) {
    res.status(400).send(`Error - ${e?.message}`);
  }
});

module.exports = authRouter;
