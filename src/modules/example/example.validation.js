const { check } = require("express-validator");
const { Example } = require("../../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const example = {};

example.storeschema = [
  check("name")
    .notEmpty()
    .withMessage("Name required")
    .isLength({ max: 20 })
    .withMessage("Max 20 char")
    .bail()
    .custom(async (value) => {
      const checkdata = await Example.findOne({
        where: Sequelize.where(Sequelize.fn("lower", Sequelize.col("name")), {
          [Op.eq]: value.trim().toLowerCase(),
        }),
      });

      if (checkdata) {
        return Promise.reject("Already exists");
      }
      return Promise.resolve();
    }),
];

example.updatechema = [
  check("name")
    .notEmpty()
    .withMessage("Name required")
    .isLength({ max: 20 })
    .withMessage("Max 20 char")
    .custom(async (value) => {
      const checkdata = await Example.findOne({
        where: Sequelize.where(Sequelize.fn("lower", Sequelize.col("name")), {
          [Op.eq]: value.trim().toLowerCase(),
        }),
      });

      if (checkdata) {
        return Promise.reject("Already exists");
      }
      return Promise.resolve();
    }),
];

module.exports = example;
