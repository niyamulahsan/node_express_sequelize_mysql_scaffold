const { Router } = require("express");
const auth = require("../modules/auth/auth.route");
const user = require("../modules/user/user.route");
const example = require("../modules/example/example.route");

const route = Router()
  .use(auth)
  .use(user)
  .use(example);

module.exports = route;