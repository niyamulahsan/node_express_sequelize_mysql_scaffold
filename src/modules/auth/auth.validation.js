const { check } = require("express-validator");
const { User } = require("../../models");

const auth = {};

auth.storeschema = [
  check("email").notEmpty().withMessage("Email is required").bail().isEmail().withMessage("Invalid email").custom(async (value) => {
    const foundEmail = await User.findOne({ where: { id: req.params.id } });

    if (foundEmail) {
      return Promise.reject("Email already exists");
    }
  }),
  check("password").notEmpty().withMessage("Password is required"),
  check("confirm_password").notEmpty().withMessage("Confirm Password required").bail().custom((value, { req, res }) => {
    if (req.body.password !== value) {
      return Promise.reject();
    }
    return Promise.resolve();
  }).withMessage("Password not matched!"),
];

auth.forgetschema = [
  check("email").notEmpty().withMessage("Email required").bail().isEmail().withMessage("Invalid format").bail().custom(async (value, { req, res }) => {
    const user = await User.findOne({ where: { email: value } });
    if (!user.email == req.body.email) {
      return Promise.reject("Email not found");
    }
    return Promise.resolve();
  }),
];

auth.resetschema = [
  check("password").notEmpty().withMessage("Password required"),
  check("confirm_password").notEmpty().withMessage("Confirm Password required").bail().custom((value, { req, res }) => {
    if (req.body.password !== value) {
      return Promise.reject();
    }
    return Promise.resolve();
  }).withMessage("Password not matched!"),
];

module.exports = auth;
