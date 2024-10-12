const role = (permission) => {
  return (req, res, next) => {
    if (permission.includes(req.role)) {
      next();
    } else {
      return res.json({ "msg": "You are not permitted" });
    }
  }
}

module.exports = role;