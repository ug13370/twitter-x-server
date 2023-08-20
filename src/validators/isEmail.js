const validator = require("validator");

function isEmail(value) {
  let validationResult = validator.isEmail(value);
  
  if (validationResult) console.info(`${value} has passed isEmail validation`);
  else console.warn(`${value} has not passed isEmail validation`);

  return validationResult;
}

module.exports = isEmail;
