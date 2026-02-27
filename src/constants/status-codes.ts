/**
 * HTTP status codes used for API responses. Use these instead of magic numbers.
 */

export const STATUS_CODES = {
  /** Request succeeded */
  OK: 200,
  /** Invalid request (e.g. validation failed) */
  BAD_REQUEST: 400,
  /** Not authenticated */
  UNAUTHORIZED: 401,
  /** Authenticated but not allowed */
  FORBIDDEN: 403,
  /** Resource not found */
  NOT_FOUND: 404,
  /** Unexpected server error */
  INTERNAL_SERVER_ERROR: 500,
};
