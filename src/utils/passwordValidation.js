/**
 * Password validation RegEx for JavaScript
 *
 * Passwords must be
 * - At least 6 characters long, max length anything
 * - Include at least 1 lowercase letter
 * - 1 capital letter
 * - 1 number
 * - 1 special character => !@#$%^&*
 *
 *
 */

const passwordValidator = (str) =>
  /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{6,}$/.test(
    str
  );

export default passwordValidator;
