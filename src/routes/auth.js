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
    const isProd = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      secure: isProd, // true in prod (HTTPS), false locally (HTTP)
      sameSite: isProd ? "none" : "lax", // cross-site cookies require none+secure
      path: "/",
    };

    if (isProd && process.env.COOKIE_DOMAIN) {
      cookieOptions.domain = process.env.COOKIE_DOMAIN; // e.g. ".example.com"
    }

    res.cookie("token", token, cookieOptions);
    res.send("login successful");
  } catch (e) {
    res.status(400).send(`Error - ${e?.message}`);
  }
});

module.exports = authRouter;
