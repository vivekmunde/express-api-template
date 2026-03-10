/**
 * Auto-generated. Do not edit manually.
 * Source: az-api-types/types
 * Run `yarn populate:api-types` to regenerate.
 * Manual changes will be overwritten.
 */

/**
 * Error codes for API responses.
 * Aligns with common HTTP status semantics and REST conventions.
 */
export type TResponseErrorCode =
  | "BAD_REQUEST" // 400
  | "UNAUTHORIZED" // 401
  | "FORBIDDEN" // 403
  | "NOT_FOUND" // 404
  | "METHOD_NOT_ALLOWED" // 405
  | "CONFLICT" // 409
  | "UNPROCESSABLE_ENTITY" // 422
  | "TOO_MANY_REQUESTS" // 429
  | "INTERNAL_SERVER_ERROR" // 500
  | "BAD_GATEWAY" // 502
  | "SERVICE_UNAVAILABLE" // 503
  | "GATEWAY_TIMEOUT" // 504
  | "ERROR"; // Generic fallback

/**
 * Model collection response.
 * @template TDataModel - Type of the data model.
 */
export type TResponseDataModelCollection<TDataModel> = {
  /** Items in the collection. */
  items?: TDataModel[];
  /** Total count of items in the collection. */
  total?: number;
};

/** Nested map of field paths to error messages (supports nested validation). */
export type TResponseValidationErrors = {
  [key: string]: string | TResponseValidationErrors;
};

/**
 * Standard API response shape. Exactly one of data, validationErrors, or error
 * is typically present depending on outcome.
 *
 * @template TDataModel - Type of the success payload when data is present
 * @template TErrorCode - String literal type for error.code
 */
export type TResponseBody<TDataModel, TErrorCode extends string = string> = {
  /** Present on success */
  data?: TDataModel;
  /** Present when validation failed */
  validationErrors?: TResponseValidationErrors;
  /** Present when an error occurred */
  error?: { code: TErrorCode; message: string };
};
