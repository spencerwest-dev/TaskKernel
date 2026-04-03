
// passwordValidator.test.jsx
// To run ONLY these tests (recommended):
//   1. Clone the repo: git clone https://github.com/spencerwest-dev/TaskKernel.git
//   2. Navigate to the frontend folder: cd TaskKernel/frontend
//   3. Install dependencies: npm install
//   4. Run this specific test file: npm test -- --watchAll=false --testPathPattern=passwordValidator.test.js
//
// NOTE: If you run all tests with "npm test -- --watchAll=false", App.test.js will
// fail due to a separate unrelated dependency issue. That failure is not part of
// this ticket. Run the command above to see only the passwordValidator tests.
import { validatePassword } from "./passwordValidator";

describe("Password Validation - Pure Logic", () => {
  test("all fields empty returns error", () => {
    expect(validatePassword({ username: "", password: "", confirmPassword: "" }))
      .toBe("All fields are required.");
  });

  test("missing username returns error", () => {
    expect(validatePassword({ username: "", password: "123", confirmPassword: "123" }))
      .toBe("All fields are required.");
  });

  test("missing password returns error", () => {
    expect(validatePassword({ username: "user", password: "", confirmPassword: "123" }))
      .toBe("All fields are required.");
  });

  test("missing confirm password returns error", () => {
    expect(validatePassword({ username: "user", password: "123", confirmPassword: "" }))
      .toBe("All fields are required.");
  });

  test("passwords do not match returns error", () => {
    expect(validatePassword({ username: "user", password: "123", confirmPassword: "456" }))
      .toBe("Passwords do not match.");
  });

  test("matching passwords returns empty string", () => {
    expect(validatePassword({ username: "user", password: "123", confirmPassword: "123" }))
      .toBe("");
  });

  test("trims whitespace correctly", () => {
    expect(validatePassword({ username: "   ", password: "   ", confirmPassword: "   " }))
      .toBe("All fields are required.");
  });
});