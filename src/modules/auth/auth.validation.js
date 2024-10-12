const { check } = require("express-validator");

const auth = {};

auth.storeschema = [
  check("email").notEmpty().withMessage("Email is required").bail().isEmail().withMessage("Invalid email"),
  check("password").notEmpty().withMessage("Password is required"),
  check("confirm_password").notEmpty().withMessage("Confirm Password required").bail().custom((value, { req, res }) => {
    if (req.body.password !== value) {
      return Promise.reject();
    }
    return Promise.resolve();
  }).withMessage("Password not matched!"),
];

module.exports = auth;