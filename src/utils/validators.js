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

const validateCreateNotesRequest = (req) => {
  const ALLOWED_KEYS = ["title", "content", "tags"];

  validateKeys(req, ALLOWED_KEYS);

  const { title, content, tags = [] } = req.body;

  if (!title) {
    throw new Error("title missing from request");
  }

  if (!content) {
    throw new Error("content missing from request");
  }

  if (tags.length > 15) {
    throw new Error("maximum of 15 tags can be sent");
  }
};

const validateUpdateNotesRequest = (req) => {
  const ALLOWED_KEYS = ["title", "content", "tags"];

  validateKeys(req, ALLOWED_KEYS);
};

module.exports = {
  validateSignUpRequest,
  validateLoginRequest,
  validateCreateNotesRequest,
  validateUpdateNotesRequest,
};
