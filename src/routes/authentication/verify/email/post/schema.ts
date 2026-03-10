import { TResponseErrorCode } from "@/types/response";

/**
 * Request data for POST verify email.
 */
export type TPostVerifyEmailRequestData = {
  /** Email address to verify. */
  email: string;
};

/**
 * Response data for POST verify email.
 */
export type TPostVerifyEmailResponseData = undefined;

/**
 * Error codes returned by the POST verify email endpoint.
 */
export type TPostVerifyEmailResponseErrorCode =
  | TResponseErrorCode
  | "USER_DOES_NOT_EXIST";
