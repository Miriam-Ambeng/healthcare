const { translate } = require("../i18n/translator");

function notFound(req, res) {
  res.status(404).json({
    success: false,
    message: translate(req.language, "notFound")
  });
}

function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || 500;

  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: translate(req.language, "duplicateResource")
    });
  }

  return res.status(statusCode).json({
    success: false,
    message: error.message || translate(req.language, "serverError")
  });
}

module.exports = {
  notFound,
  errorHandler
};
