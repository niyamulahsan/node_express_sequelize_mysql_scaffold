const jwt = require("jsonwebtoken");
const { Role } = require("../models"); //

const authentication = async (req, res, next) => {
  const token = req.cookies[process.env.COOKIE_NAME];
  try {
    if (!token) {
      return res.json({ "msg": "Unauthorized!" });
    }

    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        err = {
          name: 'TokenExpiredError',
          message: 'jwt expired'
        }
        return res.json({ "msg": err });
      }

      const { id, email, role, status } = decoded;
      const foundRole = await (await Role.findOne({ where: { id: role } })).get();
      req.id = id;
      req.email = email;
      req.status = status;
      req.role = foundRole.name;
      next();
    });
  } catch (err) {
    next("Authentication Failure!");
  }
};

module.exports = authentication;