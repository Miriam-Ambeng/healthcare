const jwt = require("jsonwebtoken");
const env = require("../config/env");
const User = require("../models/User");
const { translate } = require("../i18n/translator");

async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [type, token] = header.split(" ");

    if (type !== "Bearer" || !token) {
      return res.status(401).json({
        success: false,
        message: translate(req.language, "authRequired")
      });
    }

    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: translate(req.language, "authRequired")
      });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: translate(req.language, "authRequired")
    });
  }
}

function allowRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: translate(req.language, "forbidden")
      });
    }

    return next();
  };
}

module.exports = {
  protect,
  allowRoles
};
