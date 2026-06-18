const { normalizeLanguage } = require("../i18n/translator");

function attachLanguage(req, res, next) {
  req.language = normalizeLanguage(req.headers["accept-language"]);
  next();
}

module.exports = {
  attachLanguage
};
