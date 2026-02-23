import { describe, expect, it } from "vitest";

import { loginFormSchema } from "../utils";

describe("loginFormSchema", () => {
  it("should validate a correct username and password", async () => {
    const validData = {
      username: "validUser",
      password: "Password1!", // must match PASSWORD_REGEX
    };

    await expect(loginFormSchema.validate(validData)).resolves.toEqual(
      validData
    );
  });

  it("should fail if username is empty", async () => {
    const invalidData = {
      username: "",
      password: "Password1!",
    };

    await expect(loginFormSchema.validate(invalidData)).rejects.toThrow(
      "validations.username.required"
    );
  });

  it("should fail if username is too short", async () => {
    const invalidData = {
      username: "ab", // shorter than MIN_USER_NAME_LENGTH
      password: "Password1!",
    };

    await expect(loginFormSchema.validate(invalidData)).rejects.toThrow(
      "validations.username.userNameMinimumLength"
    );
  });

  it("should fail if password is empty", async () => {
    const invalidData = {
      username: "validUser",
      password: "",
    };

    await expect(loginFormSchema.validate(invalidData)).rejects.toThrow(
      "validations.password.required"
    );
  });

  it("should fail if password does not match regex", async () => {
    const invalidData = {
      username: "validUser",
      password: "invalidpass", // does not match PASSWORD_REGEX
    };

    await expect(loginFormSchema.validate(invalidData)).rejects.toThrow(
      "validations.password.matchesRegex"
    );
  });
});
