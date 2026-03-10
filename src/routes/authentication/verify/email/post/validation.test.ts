import { describe, expect, it } from "vitest";
import {
  postVerifyEmailValidationSchema,
  type TPostVerifyEmailValidationMessages,
} from "./validation";

const defaultMessages: TPostVerifyEmailValidationMessages = {
  email: {
    required: "Email is required",
    invalid: "Email is invalid",
  },
};

describe("postVerifyEmailValidationSchema", () => {
  const schema = postVerifyEmailValidationSchema(defaultMessages);

  describe("valid inputs", () => {
    it("accepts a valid email", () => {
      const result = schema.safeParse({ email: "user@example.com" });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe("user@example.com");
      }
    });

    it("accepts email with subdomain", () => {
      const result = schema.safeParse({ email: "user@mail.example.com" });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe("user@mail.example.com");
      }
    });

    it("trims leading and trailing whitespace from email", () => {
      const result = schema.safeParse({ email: "  user@example.com  " });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe("user@example.com");
      }
    });

    it("accepts email with plus addressing", () => {
      const result = schema.safeParse({ email: "user+tag@example.com" });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe("user+tag@example.com");
      }
    });
  });

  describe("required validation", () => {
    it("fails when email is empty string", () => {
      const result = schema.safeParse({ email: "" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          defaultMessages.email.required
        );
      }
    });

    it("fails when email is undefined and defaults to empty", () => {
      const result = schema.safeParse({});
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          defaultMessages.email.required
        );
      }
    });

    it("fails when email is only whitespace (trimmed to empty)", () => {
      const result = schema.safeParse({ email: "   " });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          defaultMessages.email.required
        );
      }
    });
  });

  describe("invalid format validation", () => {
    it("fails when email has no @", () => {
      const result = schema.safeParse({ email: "userexample.com" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          defaultMessages.email.invalid
        );
      }
    });

    it("fails when email has no domain", () => {
      const result = schema.safeParse({ email: "user@" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          defaultMessages.email.invalid
        );
      }
    });

    it("fails when email has no local part", () => {
      const result = schema.safeParse({ email: "@example.com" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          defaultMessages.email.invalid
        );
      }
    });

    it("fails when email has invalid characters", () => {
      const result = schema.safeParse({ email: "user<>@example.com" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          defaultMessages.email.invalid
        );
      }
    });
  });

  describe("custom messages", () => {
    it("uses custom required message when provided", () => {
      const customSchema = postVerifyEmailValidationSchema({
        email: {
          required: "Please enter your email",
          invalid: "Invalid email format",
        },
      });
      const result = customSchema.safeParse({ email: "" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Please enter your email");
      }
    });

    it("uses custom invalid message when provided", () => {
      const customSchema = postVerifyEmailValidationSchema({
        email: {
          required: "Email is required",
          invalid: "Please provide a valid email address",
        },
      });
      const result = customSchema.safeParse({ email: "notanemail" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Please provide a valid email address"
        );
      }
    });
  });
});
