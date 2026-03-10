import { z } from "zod";

/**
 * Validation messages for POST verify email.
 */
type TPostVerifyEmailValidationMessages = {
  email: {
    required: string;
    invalid: string;
  };
};

/**
 * Validation schema for POST verify email.
 */
const postVerifyEmailValidationSchema = (
  messages: TPostVerifyEmailValidationMessages
) =>
  z.object({
    email: z
      .string()
      .trim()
      .default("")
      .refine((value) => value.length > 0, {
        message: messages.email.required,
      })
      .refine((value) => value === "" || z.email().safeParse(value).success, {
        message: messages.email.invalid,
      }),
  });

export {
  postVerifyEmailValidationSchema,
  type TPostVerifyEmailValidationMessages,
};
