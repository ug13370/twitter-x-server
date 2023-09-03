function isPassword(value: string): boolean {
  // Check if the password is at least 5 characters long
  if (value.length < 5) {
    console.error("Password validation failed.");
    return false;
  }

  // Define a regular expression pattern for special characters
  const specialCharPattern = /[!@#$%^&*()_+[\]{};':"\\|,.<>/?]/g;

  // Count the number of special characters in the password
  const specialCharCount = (value.match(specialCharPattern) || []).length;

  // Check if there are at least 2 special characters
  if (specialCharCount < 2) {
    console.error("Password validation failed.");
    return false;
  }

  // If all checks pass, consider the password valid
  console.info("Password validation passed.");
  return true;
}

export default isPassword;
