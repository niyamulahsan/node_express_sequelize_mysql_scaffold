const { User, Role } = require('../../models');
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const auth = {};

/**
 * user register
 */
auth.register = async (req, res, next) => {
  try {
    const role = await Role.findOne({ where: { name: "user" } });

    const data = {
      name: req.body.name,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10),
      confirm_password: req.body.confirm_password
    };

    data.status = "1";
    data.forget_password = req.body.password;
    data.role_id = role.id;

    delete data["confirm_password"];

    await User.create(data);

    return res.json({ "msg": "Successfully registered" });
  } catch (err) {
    next(err);
  }
};

/**
 * user login function
 */
auth.login = async (req, res, next) => {
  try {
    const data = {
      email: req.body.email,
      password: req.body.password
    };

    if (req.body.email == "" || req.body.password == "") {
      return res.status(400).json({ "msg": "Invalid credential" });
    }

    const userdata = await User.findOne({ where: { email: data.email } });

    if (!userdata) {
      return res.status(400).json({ "msg": "Invalid credential" });
    }

    const password = await bcrypt.compare(data.password, userdata.password);

    if (!password) {
      return res.status(400).json({ "msg": "Invalid credential" });
    }

    if (userdata.status !== "1") {
      return res.status(400).json({ "msg": "Invalid credential" });
    }

    const token = jwt.sign({ id: userdata.id, email: userdata.email, role: userdata.role_id, status: userdata.status }, process.env.TOKEN_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRE,
    });

    res.cookie(process.env.COOKIE_NAME, token, {
      httpOnly: true,
      maxAge: process.env.TOKEN_EXPIRE
    });

    return res.json({
      token: token,
      expiresIn: (process.env.TOKEN_EXPIRE / (60 * 60 * 24 * 1000) + " days")
    });
  } catch (err) {
    next(err);
  }
};

/**
 * user logout function
 */
auth.logout = async (req, res, next) => {
  try {
    const token = req.cookies[process.env.COOKIE_NAME];

    if (!token) {
      return res.sendStatus(204);
    }

    res.clearCookie(process.env.COOKIE_NAME);

    return res.status(200).json({ "msg": "Logout" });
  } catch (err) {
    next(err);
  }
};

/**
 * user check for authetication
 */
auth.me = async (req, res, next) => {
  // try {
  const auth = await User.findOne({ where: { email: req.email }, include: [{ model: Role, as: "role" }] });

  return res.json({ "auth": auth });
  // } catch (err) {
  //   next(err);
  // }
};

module.exports = auth;