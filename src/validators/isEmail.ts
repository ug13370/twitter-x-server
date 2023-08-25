import validator from "validator";

function isEmail(value: string): boolean {
  let validationResult = validator.isEmail(value);

  if (validationResult) console.info(`${value} has passed isEmail validation`);
  else console.warn(`${value} has not passed isEmail validation`);

  return validationResult;
}

export default isEmail;
