const { Router } = require("express");
const role = require("../modules/role/role.route");
const auth = require("../modules/auth/auth.route");
const user = require("../modules/user/user.route");
const example = require("../modules/example/example.route");

const route = Router()
  .use(role)
  .use(auth)
  .use(user)
  .use(example);

module.exports = route;