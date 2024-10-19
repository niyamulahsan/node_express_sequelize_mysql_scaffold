const { check } = require("express-validator");
const { User, Role } = require("../../models");

const user = {};

user.storeschema = [
  check("name").notEmpty().withMessage("Name required"),
  check("email").notEmpty().withMessage("Email required").bail().isEmail().withMessage("Invalid Email").bail().custom(async (value) => {
    const foundEmail = await User.findOne({ where: { email: value } });

    if (foundEmail) {
      return Promise.reject("Email already exists");
    }
  }),
  check("password").notEmpty().withMessage("Password required"),
  check("confirm_password").notEmpty().withMessage("Confirm Password required").bail().custom((value, { req, res }) => {
    if (req.body.password !== value) {
      return Promise.reject();
    }
    return Promise.resolve();
  }).withMessage("Password not matched!"),
  check("forget_password").optional({ nullable: true }),
  check("role_id").notEmpty().withMessage("Role required").bail().custom(async (value, { req, res }) => {
    const role = await Role.findOne({ where: { id: value } });

    if (["admin"].includes(role.name)) {
      return Promise.reject("Can't create admin user");
    }

    return Promise.resolve();
  }),
];

user.updatechema = [
  check("name").notEmpty().withMessage("Name required"),
  check("password").optional({ nullable: true }),
  check("confirm_password").custom((value, { req, res }) => {
    if (req.body.password !== value) {
      return Promise.reject();
    }
    return Promise.resolve();
  }).withMessage("Password not matched!"),
  check("forget_password").optional({ nullable: true }),
  check("role_id").custom(async (value, { req, res }) => {
    // check who is logged in
    const auth = await User.findOne({ where: { email: req.email }, include: [{ model: Role, as: "role" }] });

    if (["admin"].includes(auth.role.name)) {
      return Promise.reject("Role required");
    }

    const role = await Role.findOne({ where: { id: value } });

    if (['admin'].includes(role.name)) {
      return Promise.reject("Can't update with admin role");
    }

    return Promise.resolve();
  }),
];

user.statusschema = [
  check("status").notEmpty().withMessage("Status required").bail().isIn(["0", "1"]).withMessage("Status will be 0 or 1").bail().custom(async (value, { req, res }) => {
    const auth = await User.findOne({ where: { email: req.email }, include: [{ model: Role, as: "role" }] });

    const user = await User.findOne({ where: { id: req.params.id }, include: [{ model: Role, as: "role" }] });

    if (["admin"].includes(auth.role.name)) {
      return (
        ["admin"].includes(user.role.name) && Promise.reject("Can't update")
      );
    }

    Promise.resolve();
  }),
];

module.exports = user;
