const { validationResult } = require("express-validator");
const User = require("../models/User");
const { signToken } = require("../utils/token");
const { translate } = require("../i18n/translator");

function normalizeCameroonPhone(phone) {
  if (!phone) {
    return phone;
  }

  const compact = phone.replace(/\s+/g, "");

  if (compact.startsWith("+")) {
    return compact;
  }

  const digits = compact.replace(/\D/g, "");

  if (digits.startsWith("237")) {
    return `+${digits}`;
  }

  if (digits.startsWith("0")) {
    return `+237${digits.slice(1)}`;
  }

  return `+237${digits}`;
}

function userResponse(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    preferredLanguage: user.preferredLanguage,
    specialization: user.specialization,
    onmcNumber: user.onmcNumber,
    schedule: user.schedule
  };
}

async function register(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    const user = await User.create({
      ...req.body,
      phone: normalizeCameroonPhone(req.body.phone),
      onmcNumber: req.body.onmcNumber?.trim()
    });
    const token = signToken(user);

    return res.status(201).json({
      success: true,
      message: translate(req.language, "registerSuccess"),
      token,
      data: userResponse(user)
    });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    const user = await User.findOne({ email: req.body.email }).select("+password");

    if (!user || !(await user.comparePassword(req.body.password))) {
      return res.status(401).json({
        success: false,
        message: translate(req.language, "invalidCredentials")
      });
    }

    const token = signToken(user);

    return res.json({
      success: true,
      message: translate(req.language, "loginSuccess"),
      token,
      data: userResponse(user)
    });
  } catch (error) {
    return next(error);
  }
}

function me(req, res) {
  res.json({
    success: true,
    data: userResponse(req.user)
  });
}

module.exports = {
  register,
  login,
  me
};
