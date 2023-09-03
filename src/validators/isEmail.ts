import validator from "validator";

function isEmail(value: string): boolean {
  // Use the validator library to check if the value is a valid email address.
  const validationResult = validator.isEmail(value);

  // Log validation results to the console.
  if (validationResult) {
    console.info(`Email validation passed.`);
  } else {
    console.error(`Email validation failed.`);
  }

  // Return the validation result (true for valid, false for invalid).
  return validationResult;
}

export default isEmail;
