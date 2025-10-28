const validator = require("validator");

const validateKeys = (req, keys) => {
  Object.keys(req.body).forEach((key) => {
    if (!keys.includes(key)) {
      throw new Error(`invalid key ${key} in request`);
    }
  });
};
const validateSignUpRequest = (req) => {
  const ALLOWED_KEYS = ["firstName", "lastName", "emailId", "password"];

  validateKeys(req, ALLOWED_KEYS);

  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("firstName and lastName is required");
  }
  if (!emailId) {
    throw new Error("emailid is required");
  }
  if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  }
  if (!password) {
    throw new Error("password is required");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("password is not Strong");
  }
};

const validateLoginRequest = (req) => {
  const ALLOWED_KEYS = ["emailId", "password"];

  validateKeys(req, ALLOWED_KEYS);
  const { emailId, password } = req.body;
  if (!emailId) {
    throw new Error("emailid is required");
  }
  if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  }
  if (!password) {
    throw new Error("password is required");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("password is not Strong");
  }
};

module.exports = { validateSignUpRequest, validateLoginRequest };
