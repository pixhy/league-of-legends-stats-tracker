import { hashPassword, comparePassword } from "../utils/hash.js";

describe("Password Hashing", () => {
  test("should hash a password and not match the original", async () => {
    const password = "myPassword123";
    const hashed = await hashPassword(password);

    expect(hashed).not.toBe(password);
  });

  test("should correctly compare a password with its hash", async () => {
    const password = "myPassword123";
    const hashed = await hashPassword(password);

    const isMatch = await comparePassword(password, hashed);
    expect(isMatch).toBe(true);
  });

  test("should fail comparison if the passwords do not match", async () => {
    const password = "myPassword123";
    const wrongPassword = "wrongPassword";
    const hashed = await hashPassword(password);

    const isMatch = await comparePassword(wrongPassword, hashed);
    expect(isMatch).toBe(false);
  });
});
