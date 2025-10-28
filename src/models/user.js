const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      maxLength: 50,
      required: true,
    },
    lastName: {
      type: String,
      maxLength: 50,
      required: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Not a valid password");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Not a strong password");
        }
      },
    },
    verified: {
      type: Boolean,
      default: false,
      validate(value) {
        if (![true, false].includes(value)) {
          throw new Error("not a boolean value");
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.hashPassword = async function () {
  let user = this;
  let passwordHash = await bcrypt.hash(user.password, 10);
  user.password = passwordHash;
};

userSchema.methods.validatePassword = async function (inputPassoword) {
  let user = this;
  let passwordHash = user.password;
  return await bcrypt.compare(inputPassoword, passwordHash);
};

userSchema.methods.generateAuthToken = function () {
  let user = this;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
