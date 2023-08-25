function isPassword(value: string): boolean {
  let validationResult = true;

  validationResult = validationResult && value.length > 0;
  return validationResult;
}

export default isPassword;
