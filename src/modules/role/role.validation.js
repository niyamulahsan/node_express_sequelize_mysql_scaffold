const { check } = require("express-validator");
const { Role } = require("../../models");

const role = {};

role.storeschema = [ // currently not use in route
  check("name")
    .notEmpty()
    .withMessage("Name required")
    .isLength({ max: 20 })
    .withMessage("Max 20 char")
    .bail()
    .custom(async (value) => {
      const checkdata = await Role.findOne({
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

role.updatechema = [ // currently not use in route
  check("name")
    .notEmpty()
    .withMessage("Name required")
    .isLength({ max: 20 })
    .withMessage("Max 20 char")
    .custom(async (value) => {
      const checkdata = await Role.findOne({
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

module.exports = role;
