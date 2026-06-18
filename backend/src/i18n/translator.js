const messages = require("./messages");

function normalizeLanguage(languageHeader) {
  if (!languageHeader) {
    return "en";
  }

  const language = languageHeader.split(",")[0].trim().slice(0, 2).toLowerCase();
  return messages[language] ? language : "en";
}

function translate(language, key) {
  const normalized = messages[language] ? language : "en";
  return messages[normalized][key] || messages.en[key] || key;
}

module.exports = {
  normalizeLanguage,
  translate
};
