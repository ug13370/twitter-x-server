import validator from "validator";

/**
 * Validate whether a value is a valid email address.
 * @param {string} value - The value to be validated.
 * @returns {boolean} - True if the value is a valid email address, false otherwise.
 */
function isEmail(value: string): boolean {
  // Use the validator library to check if the value is a valid email address.
  const validationResult = validator.isEmail(value);

  // Log validation results to the console.
  if (validationResult) {
    console.info(`${value} has passed isEmail validation.`);
  } else {
    console.warn(`${value} is not a valid email address.`);
  }

  // Return the validation result (true for valid, false for invalid).
  return validationResult;
}

export default isEmail;
