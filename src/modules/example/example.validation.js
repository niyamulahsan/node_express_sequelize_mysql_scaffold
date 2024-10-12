const { check } = require("express-validator");
const { Example } = require("../../models");

const example = {};

example.storeschema = [
  check("name").notEmpty().withMessage("Name required").isLength({ max: 20 }).withMessage("Max 20 char")
];

example.updatechema = [
  check("name").notEmpty().withMessage("Name required").isLength({ max: 20 }).withMessage("Max 20 char")
];

module.exports = example;