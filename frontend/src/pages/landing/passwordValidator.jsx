
// passwordValidator.js
export function validatePassword({ username, password, confirmPassword }) {
  if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
    return "All fields are required.";
  }
  if (password !== confirmPassword) {
    return "Passwords do not match.";
  }
  return ""; // no error
}