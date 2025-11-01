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
    res.cookie("token", token, {
      // samesite should be none and secure should be true in production
      sameSite: "lax",
      secure: false,
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.send("login successful");
  } catch (e) {
    res.status(400).send(`Error - ${e?.message}`);
  }
});

module.exports = authRouter;
